import { Test, TestingModule } from '@nestjs/testing';
import { ThreadController } from './threads.controller';

describe('ThreadsController', () => {
  let controller: ThreadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThreadController],
    }).compile();

    controller = module.get<ThreadController>(ThreadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
