import { Controller, Get } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { QuoteQueueNames } from 'src/queues/quote.queue';

@ApiTags('Queue Monitor')
@Controller('queue-monitor')
export class QueueMonitorController {
  constructor(
    @InjectQueue(QuoteQueueNames.QUOTE_PROCESSING)
    private quoteProcessingQueue: Queue,

    @InjectQueue(QuoteQueueNames.PROVIDER_QUOTE_REQUEST)
    private providerQuoteRequestQueue: Queue,

    @InjectQueue(QuoteQueueNames.QUOTE_COMPLETION)
    private quoteCompletionQueue: Queue,
  ) {}

  @Get('status')
  @ApiOperation({ summary: 'Get queue status' })
  async getQueueStatus() {
    // Her kuyruk için detaylı durum bilgisi
    const [processingCounts, requestCounts, completionCounts] =
      await Promise.all([
        this.getQueueCounts(this.quoteProcessingQueue),
        this.getQueueCounts(this.providerQuoteRequestQueue),
        this.getQueueCounts(this.quoteCompletionQueue),
      ]);

    return {
      processing: {
        name: QuoteQueueNames.QUOTE_PROCESSING,
        ...processingCounts,
      },
      providerRequest: {
        name: QuoteQueueNames.PROVIDER_QUOTE_REQUEST,
        ...requestCounts,
      },
      completion: {
        name: QuoteQueueNames.QUOTE_COMPLETION,
        ...completionCounts,
      },
    };
  }

  private async getQueueCounts(queue: Queue) {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
      queue.getDelayedCount(),
    ]);

    return { waiting, active, completed, failed, delayed };
  }
}
