import { Test, TestingModule } from '@nestjs/testing';
import { QueueMonitorController } from './queue-monitor.controller';

describe('QueueMonitorController', () => {
  let controller: QueueMonitorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QueueMonitorController],
    }).compile();

    controller = module.get<QueueMonitorController>(QueueMonitorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
