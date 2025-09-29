import { ConfigService } from '../services/config.service';
import { Configuration } from '../models/configuration.model';
import { ProjectType } from '../enums/project-type.enum';
import { DatabaseType } from '../enums/database-type.enum';
import fs from 'fs';

jest.mock('fs');

const mockFs = fs as jest.Mocked<typeof fs>;

describe('ConfigService', () => {
  let service: ConfigService;

  beforeEach(() => {
    service = new ConfigService();
    jest.clearAllMocks();
  });

  describe('loadConfiguration', () => {
    it('should return null if config file does not exist', () => {
      mockFs.existsSync.mockReturnValue(false);

      const result = service.loadConfiguration();

      expect(result).toBeNull();
      expect(mockFs.existsSync).toHaveBeenCalledWith('projectGen.json');
    });

    it('should return parsed configuration if file exists', () => {
      const config: Configuration = {
        name: 'test',
        type: ProjectType.Nest,
        database: DatabaseType.Postgresql,
      };
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify(config));

      const result = service.loadConfiguration();

      expect(result).toEqual(config);
      expect(mockFs.readFileSync).toHaveBeenCalledWith('projectGen.json', 'utf8');
    });
  });

  describe('saveConfiguration', () => {
    it('should write configuration to file', () => {
      const config: Configuration = {
        name: 'test',
        type: ProjectType.Nest,
        database: DatabaseType.Postgresql,
      };

      service.saveConfiguration(config);

      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        'projectGen.json',
        JSON.stringify(config, null, 2)
      );
    });
  });
});