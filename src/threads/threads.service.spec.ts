import { Test, TestingModule } from '@nestjs/testing';
import { ThreadService } from './threads.service';

describe('ThreadsService', () => {
  let service: ThreadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ThreadService],
    }).compile();

    service = module.get<ThreadService>(ThreadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
