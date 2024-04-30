import chalk from 'chalk';
import fs from 'fs';
import { execSync } from "child_process";
import { Configuration } from "../models/configuration.model";
import { DatabaseType } from "../enums/database-type.enum";

export class CommonGenerator {
    TEMPLATE_DIR = `${__dirname}/../../templates/common`;

    async installDependencies(configuration : Configuration) {
        await this.installHusky();
        await this.installCommitLint();
        await this.installPrettier();
        await this.installEsLint();
        await this.installDatabase(configuration.database);

        console.log(chalk.bgGreenBright('All common dependencies are installed !'));
    }

    async configure(){
        await this.configureHusky();
        await this.configureCommitLint();
        await this.configurePrettier();
        await this.configureEsLint();
        await this.configureEditorConfig();
        await this.configureGitIgnore();

        console.log(chalk.bgGreenBright('All common dependencies are configured !'));
    }

    //#region Husky
    private async installHusky(){
        console.log(chalk.bgGreenBright('Install Husky'));

        execSync('npm install husky --save-dev');
        execSync('npm pkg set scripts.prepare="husky install"');
        execSync('npm install');
    }

    private async configureHusky(){
        console.log(chalk.bgGreenBright('Configure Husky'));

        execSync('npx husky hook .husky/commit-msg \'npx --no -- commitlint --edt $1\'');
        execSync('npx husky hook .husky/pre-commit \'npm run format && git add -A && npm run lint\'');
        execSync('npx husky hook .husky/pre-push \'npm test\'');        
        
    }
    //#endregion

    // #region CommitLint
    private async installCommitLint(){
        console.log(chalk.bgGreenBright('Install CommitLint'));
        execSync('npm install --save-dev @commitlint/config-conventional @commitlint/cli');
    }

    private async configureCommitLint(){
        console.log(chalk.bgGreenBright('Configure CommitLint'));
        fs.copyFileSync (`${this.TEMPLATE_DIR}/commitlint.config.js`, './commitlint.config.js');
    }
    //#endregion

    // #region Prettier
    private async installPrettier(){
        console.log(chalk.bgGreenBright('Install Prettier'));
        execSync('npm install --save-dev prettier');
    }

    private async configurePrettier(){
        console.log(chalk.bgGreenBright('Configure Prettier'));

        execSync('npm pkg set "scripts.format=prettier --write \"**/*.ts\""');


        fs.copyFileSync (`${this.TEMPLATE_DIR}/.prettierrc`, './prettierrc');
    }
    //#endregion

    // #region EsLint
    private async installEsLint(){
        console.log(chalk.bgGreenBright('Install EsLint'));
        execSync('npm install --save-dev eslint-config-prettier eslint-plugin-prettier eslint-plugin-security @typescript-eslint/eslint-plugin @typescript-eslint/parser');
    }

    private async configureEsLint(){
        console.log(chalk.bgGreenBright('Configure EsLint'));

        fs.copyFileSync (`${this.TEMPLATE_DIR}/.eslintrc.js`, './.eslintrc.js');

        execSync('npm pkg set scripts.lint="eslint \"{src,apps,libs,test}/**/*.ts\" --fix"');
    }
    //#endregion


    // #region EditorConfig
    private async configureEditorConfig() {
        console.log(chalk.bgGreenBright('Configure EditorConfig'));
    
        fs.copyFileSync(`${this.TEMPLATE_DIR}/.editorconfig`, './.editorconfig');
    }    
    //#endregion

    private async configureGitIgnore(){
        console.log(chalk.bgGreenBright('Configure Git Ignore'));
    
        try {
            let gitIgnore = fs.readFileSync('.gitignore', {encoding: 'utf-8'});
            if(gitIgnore.indexOf('*** Begin Git configuration ***') < 0){
                const projectGenGitIgnore = fs.readFileSync(`${this.TEMPLATE_DIR}/.projectgengitignore`, {encoding:'utf-8'});
                gitIgnore += `\n${projectGenGitIgnore}`;
                fs.writeFileSync('.gitignore', gitIgnore);
            }
        } catch (error) {
            const projectGenGitIgnore = fs.readFileSync(`${this.TEMPLATE_DIR}/.projectgengitignore`, {encoding:'utf-8'});
            fs.writeFileSync('.gitignore', projectGenGitIgnore);
        }
    }
    
    //#endregion

    // #region Database
    private async installDatabase(configDatabase : DatabaseType){

        if(configDatabase && configDatabase !== DatabaseType.None){
            execSync('npm install typeorm --save')
        }

        switch(configDatabase){
            case DatabaseType.Postgresql:
                console.log(chalk.bgGreenBright('Install PostGreSQL'));
                execSync('npm install pg --save');
                break;
            case DatabaseType.Oracle:
                console.log(chalk.bgGreenBright('Install Oracle'));
                execSync('npm install oracledb --save');
                break;
            default:
                console.log(chalk.bgGreenBright(`${configDatabase} cannot be installed yet with this script, try another one!`));   
        }
    }
    //#endregion
}