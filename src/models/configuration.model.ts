import { DatabaseType } from "../enums/database-type.enum";
import { ProjectType } from "../enums/project-type.enum";

export interface Configuration {
    name: string;
    type: ProjectType;
    database: DatabaseType;
}