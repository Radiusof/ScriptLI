import fs from 'fs'
import { Configuration } from '../models/configuration.model';

export class ConfigService {
    CONFIG_FILE_NAME = 'projectGen.json'

    loadConfiguration(): Configuration {
        if (fs.existsSync(this.CONFIG_FILE_NAME)){
            return JSON.parse(fs.readFileSync(this.CONFIG_FILE_NAME,'utf8')) as Configuration;
        }

        return null;
    }

    saveConfiguration(configuration: Configuration){
        fs.writeFileSync(this.CONFIG_FILE_NAME,JSON.stringify(configuration,null,2));
    }
}