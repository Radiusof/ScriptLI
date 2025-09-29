import { CommonGenerator } from '../generators/common.generator';
import { Configuration } from '../models/configuration.model';
import { ProjectType } from '../enums/project-type.enum';
import { DatabaseType } from '../enums/database-type.enum';
import { execSync } from 'child_process';
import fs from 'fs';

jest.mock('child_process');
jest.mock('fs');

const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;
const mockFs = fs as jest.Mocked<typeof fs>;

describe('CommonGenerator', () => {
  let generator: CommonGenerator;
  const config: Configuration = {
    name: 'test',
    type: ProjectType.Nest,
    database: DatabaseType.Postgresql,
  };

  beforeEach(() => {
    generator = new CommonGenerator();
    jest.clearAllMocks();
  });

  describe('installDependencies', () => {
    it('should call install methods', async () => {
      const installHuskySpy = jest.spyOn(generator as any, 'installHusky').mockResolvedValue(undefined);
      const installCommitLintSpy = jest.spyOn(generator as any, 'installCommitLint').mockResolvedValue(undefined);
      const installPrettierSpy = jest.spyOn(generator as any, 'installPrettier').mockResolvedValue(undefined);
      const installEsLintSpy = jest.spyOn(generator as any, 'installEsLint').mockResolvedValue(undefined);
      const installDatabaseSpy = jest.spyOn(generator as any, 'installDatabase').mockResolvedValue(undefined);

      await generator.installDependencies(config);

      expect(installHuskySpy).toHaveBeenCalled();
      expect(installCommitLintSpy).toHaveBeenCalled();
      expect(installPrettierSpy).toHaveBeenCalled();
      expect(installEsLintSpy).toHaveBeenCalled();
      expect(installDatabaseSpy).toHaveBeenCalledWith(config.database);
    });
  });

  describe('configure', () => {
    it('should call configure methods', async () => {
      const configureHuskySpy = jest.spyOn(generator as any, 'configureHusky').mockResolvedValue(undefined);
      const configureCommitLintSpy = jest.spyOn(generator as any, 'configureCommitLint').mockResolvedValue(undefined);
      const configurePrettierSpy = jest.spyOn(generator as any, 'configurePrettier').mockResolvedValue(undefined);
      const configureEsLintSpy = jest.spyOn(generator as any, 'configureEsLint').mockResolvedValue(undefined);
      const configureEditorConfigSpy = jest.spyOn(generator as any, 'configureEditorConfig').mockResolvedValue(undefined);
      const configureGitIgnoreSpy = jest.spyOn(generator as any, 'configureGitIgnore').mockResolvedValue(undefined);

      await generator.configure();

      expect(configureHuskySpy).toHaveBeenCalled();
      expect(configureCommitLintSpy).toHaveBeenCalled();
      expect(configurePrettierSpy).toHaveBeenCalled();
      expect(configureEsLintSpy).toHaveBeenCalled();
      expect(configureEditorConfigSpy).toHaveBeenCalled();
      expect(configureGitIgnoreSpy).toHaveBeenCalled();
    });
  });

  describe('installDatabase', () => {
    it('should install PostgreSQL dependencies', async () => {
      await (generator as any).installDatabase(DatabaseType.Postgresql);

      expect(mockExecSync).toHaveBeenCalledWith('yarn add typeorm');
      expect(mockExecSync).toHaveBeenCalledWith('yarn add pg');
    });

    it('should install Oracle dependencies', async () => {
      await (generator as any).installDatabase(DatabaseType.Oracle);

      expect(mockExecSync).toHaveBeenCalledWith('yarn add typeorm');
      expect(mockExecSync).toHaveBeenCalledWith('yarn add oracledb');
    });

    it('should not install for None', async () => {
      await (generator as any).installDatabase(DatabaseType.None);

      expect(mockExecSync).not.toHaveBeenCalledWith('yarn add typeorm');
    });
  });
});