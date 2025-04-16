import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { IProvider } from 'src/modules/mock/IProvider';
import { Injectable } from '@nestjs/common';
import {
  ProviderQuoteRequestJob,
  QuoteCompletionJob,
  QuoteProcessingJob,
  QuoteQueueNames,
} from 'src/queues/quote.queue';

@Injectable()
export class QuotesProcessor {
  constructor(
    @InjectQueue(QuoteQueueNames.QUOTE_PROCESSING)
    private quoteProcessingQueue: Queue<QuoteProcessingJob>,
    @InjectQueue(QuoteQueueNames.PROVIDER_QUOTE_REQUEST)
    private providerQuoteRequestQueue: Queue<ProviderQuoteRequestJob>,
    @InjectQueue(QuoteQueueNames.QUOTE_COMPLETION)
    private quoteCompletionQueue: Queue<QuoteCompletionJob>,
  ) {}
  private readonly insuranceProviders: (IProvider | null)[] = [];

  async addQuoteProcessingJob(data: QuoteProcessingJob) {
    return this.quoteProcessingQueue.add('process', data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      timeout: 30000,
    });
  }

  async addProviderQuoteRequestJob(data: ProviderQuoteRequestJob) {
    return this.providerQuoteRequestQueue.add('request', data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      timeout: 30000,
    });
  }

  async addQuoteCompletionJob(data: QuoteCompletionJob) {
    return this.quoteCompletionQueue.add('complete', data, {
      attempts: 2,
      backoff: {
        type: 'fixed',
        delay: 2000,
      },
    });
  }
}
