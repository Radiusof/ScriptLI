import {Configuration} from '../../models/configuration.model'

export interface GeneratorInterface {
    create(configuration: Configuration): Promise<any>;
    update(configuration: Configuration): Promise<any>;
}