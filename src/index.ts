#!/usr/bin/env node

import chalk from 'chalk';
import figlet from 'figlet'
import inquirer, {QuestionCollection} from 'inquirer'
import { ConfigService } from './services/config.service';
import { ProjectType } from './enums/project-type.enum';
import { DatabaseType } from './enums/database-type.enum';
import { Configuration } from './models/configuration.model';
import { NestGenerator } from './generators/nest.generator';
import { GeneratorInterface } from './generators/interfaces/generator.interface';

export class Starter {
    //TODO create TS / NodeJS Generator ?
    static generators: Map<ProjectType,GeneratorInterface> = new Map <ProjectType,GeneratorInterface>([
        [ProjectType.Nest, new NestGenerator()],
    ])
    
    static async main(){
        console.log(chalk.bold.green(figlet.textSync('Project Generator')));

        const configService = new ConfigService();
        const configuration = configService.loadConfiguration();

        if(configuration){
            console.log(chalk.bold.green(figlet.textSync(`Update project: ${configuration.name}`)));

            await this.generators.get(configuration.type).update(configuration);
        } else {
            console.log(chalk.bold.green(figlet.textSync(`Create project`)));
            const userQuestions: QuestionCollection = [
                {
                    name: 'project-name',
                    type: 'input',
                    message: 'Name of project ?',
                },
                {
                    name: 'project-type',
                    type: 'list',
                    choices: Object.values(ProjectType),
                    message: 'Type of project ?',
                },
                {
                    name: 'database',
                    type: 'list',
                    choices: Object.values(DatabaseType),
                    message: 'Databased used ?',
                },
            ];

            const answers = await inquirer.prompt(userQuestions);

            console.table(answers)

            const configuration: Configuration = {
                name: answers['project-name'],
                type: answers['project-type'],
                database : answers['database']
            };

            await this.generators.get(configuration.type).create(configuration);
            await configService.saveConfiguration(configuration);
        }
    }
}

Starter.main();