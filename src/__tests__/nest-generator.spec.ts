import { NestGenerator } from '../generators/nest.generator';
import { Configuration } from '../models/configuration.model';
import { ProjectType } from '../enums/project-type.enum';
import { DatabaseType } from '../enums/database-type.enum';
import { execSync } from 'child_process';
import fs from 'fs';

jest.mock('child_process');
jest.mock('fs');

const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;
const mockFs = fs as jest.Mocked<typeof fs>;

describe('NestGenerator', () => {
  let generator: NestGenerator;
  const config: Configuration = {
    name: 'test',
    type: ProjectType.Nest,
    database: DatabaseType.Postgresql,
  };

  beforeEach(() => {
    generator = new NestGenerator();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call create methods', async () => {
      const createNestProjectSpy = jest.spyOn(generator as any, 'createNestProject').mockResolvedValue(undefined);
      const installDependenciesSpy = jest.spyOn(generator as any, 'installDependencies').mockResolvedValue(undefined);
      const configureDependenciesSpy = jest.spyOn(generator as any, 'configureDependencies').mockResolvedValue(undefined);

      await generator.create(config);

      expect(createNestProjectSpy).toHaveBeenCalledWith(config);
      expect(installDependenciesSpy).toHaveBeenCalledWith(config);
      expect(configureDependenciesSpy).toHaveBeenCalledWith(config);
    });
  });

  describe('update', () => {
    it('should call update methods', async () => {
      const installDependenciesSpy = jest.spyOn(generator as any, 'installDependencies').mockResolvedValue(undefined);
      const configureDependenciesSpy = jest.spyOn(generator as any, 'configureDependencies').mockResolvedValue(undefined);

      await generator.update(config);

      expect(installDependenciesSpy).toHaveBeenCalledWith(config);
      expect(configureDependenciesSpy).toHaveBeenCalledWith(config);
    });
  });

  describe('configurePipeline', () => {
    it('should copy Dockerfile for PostgreSQL', async () => {
      await (generator as any).configurePipeline(config);

      expect(mockFs.copyFileSync).toHaveBeenCalledWith(
        `${generator['TEMPLATE_DIR']}/DockerFile`,
        './Dockerfile'
      );
    });

    it('should copy OracleDockerFile for Oracle', async () => {
      const oracleConfig = { ...config, database: DatabaseType.Oracle };
      await (generator as any).configurePipeline(oracleConfig);

      expect(mockFs.copyFileSync).toHaveBeenCalledWith(
        `${generator['TEMPLATE_DIR']}/OracleDockerFile `,
        './Dockerfile'
      );
    });

    it('should not copy for None', async () => {
      const noneConfig = { ...config, database: DatabaseType.None };
      await (generator as any).configurePipeline(noneConfig);

      expect(mockFs.copyFileSync).not.toHaveBeenCalled();
    });
  });
});