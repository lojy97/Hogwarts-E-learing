import { Test, TestingModule } from '@nestjs/testing';
import { ChatRoomController } from './chat.controller';

describe('ChatController', () => {
  let controller: ChatRoomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatRoomController],
    }).compile();

    controller = module.get<ChatRoomController>(ChatRoomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
