import { Module } from '@nestjs/common';
import { QueueMonitorController } from './queue-monitor.controller';
import { BullModule } from '@nestjs/bull';
import { QuoteQueueNames } from 'src/queues/quote.queue';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: QuoteQueueNames.QUOTE_PROCESSING },
      { name: QuoteQueueNames.PROVIDER_QUOTE_REQUEST },
      { name: QuoteQueueNames.QUOTE_COMPLETION },
    ),
  ],
  controllers: [QueueMonitorController],
})
export class QueueMonitorModule {}
