import { Test, TestingModule } from '@nestjs/testing';
import { AtlasBackupService } from './atlas-backup.service';

describe('AtlasBackupService', () => {
  let service: AtlasBackupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AtlasBackupService],
    }).compile();

    service = module.get<AtlasBackupService>(AtlasBackupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
