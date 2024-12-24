import { Test, TestingModule } from '@nestjs/testing';
import { ConversationService } from './conversation.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation } from './models/conversation.schema';

describe('ConversationService', () => {
  let service: ConversationService;
  let model: Model<Conversation>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationService,
        {
          provide: getModelToken(Conversation.name),
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            findOne: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ConversationService>(ConversationService);
    model = module.get<Model<Conversation>>(getModelToken(Conversation.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
