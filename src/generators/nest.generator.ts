import chalk from 'chalk';
import fs from 'fs';

import { Configuration } from '../models/configuration.model';
import {GeneratorInterface} from '../generators/interfaces/generator.interface';
import { CommonGenerator } from './common.generator';
import { execSync } from 'child_process';
import { DatabaseType } from '../enums/database-type.enum';


export class NestGenerator implements GeneratorInterface {
    TEMPLATE_DIR = `${__dirname}/../../templates/nest`;
    commonGenerator: CommonGenerator = new CommonGenerator();

    async create(configuration : Configuration): Promise<any>{
        await this.createNestProject(configuration);
        await this.installDependencies(configuration);
        await this.configureDependencies(configuration);
    }

    async update(configuration : Configuration): Promise<any>{
        await this.installDependencies(configuration);
        await this.configureDependencies(configuration);
    }

    private async createNestProject(configuration:Configuration){
        console.log(chalk.bold.white('Generating NestJs Project'));

        execSync(`nest new ${configuration.name} --package-manager npm --skip-install`, {stdio: 'inherit'});
        process.chdir(configuration.name);
    }

    private async installDependencies(configuration : Configuration){
        console.log(chalk.bgGreenBright('Starting dependencies installation ...'));

        await this.commonGenerator.installDependencies(configuration);
        await this.installNestJsDependencies();
        await this.installHelmet();
        await this.installCompoDoc();
        await this.installJest();

        console.log(chalk.bgGreenBright('All Nest dependencies are installed !'));
    }

    private async configureDependencies(configuration : Configuration){
        console.log(chalk.bgGreenBright('Starting dependencies configuration ...'));

        await this.commonGenerator.configure();
        await this.configureCompoDoc();
        await this.configureJest();
        await this.configurePipeline(configuration);

        console.log(chalk.bgGreenBright('All NestJs dependencies are configured !'));
    }

    private async installNestJsDependencies(){
        console.log(chalk.bgGreenBright('Installing NestJs Dependencies ...'));

        execSync('yarn add @nestjs/config @nestjs/terminus nestjs-pino class-transformer class-validator');
    }

    private async installCompoDoc(){
        console.log(chalk.bgGreenBright('Installing CompoDoc ...'));
        execSync('yarn add --dev @compodoc/compodoc');
    }

    private async configureCompoDoc(){
        console.log(chalk.bgGreenBright('Configuring CompoDoc ...'));
        execSync('npm pkg  set scripts.compodoc="npx @compodoc/compodoc -p tsconfig.json"');
    }

    private async installHelmet(){
        console.log(chalk.bgGreenBright('Installing Helmet ...'));

        execSync('yarn add helmet');
    }

    private async installJest(){
        console.log(chalk.bgGreenBright('Installing Jest ...'));
        execSync('yarn add --dev jest-junit');
    }

    private async configureJest(){
        console.log(chalk.bgGreenBright('Configuring Jest ...'));
        fs.copyFileSync(`${this.TEMPLATE_DIR}/jest.config.js`, './jest.config.js');
        execSync('npm pkg  set scripts.test="jest --config jest.config.js"');
        execSync('npm pkg  set scripts.test:watch="jest --watch --config jest.config.js"');
        execSync('npm pkg  set scripts.test:cov="jest --coverage --config jest.config.js"');
        execSync('npm pkg  set scripts.test:debug="node --inspect-brk -r tsconfig-path/register -t ts-node/register node_modules/.bin/jest --runInBand --config jest.config.js"');
    }

    private async configurePipeline(configuration : Configuration) {
        console.log(chalk.bgGreenBright('Configuring Pipeline ...'));
        switch(configuration.database){
            case DatabaseType.Postgresql: 
                fs.copyFileSync(`${this.TEMPLATE_DIR}/DockerFile` , './Dockerfile');
                break;
            case DatabaseType.Oracle:
                fs.copyFileSync(`${this.TEMPLATE_DIR}/OracleDockerFile ` , './Dockerfile');
                break;
            default:
                console.log(chalk.bgGreenBright('No Pipeline to configure'));
        }
    }
}