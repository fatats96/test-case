import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { QuoteProcessingJob, QuoteQueueNames } from 'src/queues/quote.queue';
import { QuotesProcessor } from '../processors/quotes.processor';
import { QuoteEmitter } from '../emitters/quote.emitter';

@Processor(QuoteQueueNames.QUOTE_PROCESSING)
export class QuoteProcessingConsumer {
  private readonly providers = [
    'Sigorta Şirketi A',
    'Sigorta Şirketi B',
    'Sigorta Şirketi C',
  ];

  constructor(
    private readonly quoteQueueProducer: QuotesProcessor,
    private readonly quoteEmitter: QuoteEmitter,
  ) {}

  @Process('process')
  async processQuote(job: Job<QuoteProcessingJob>) {
    const { requestId, plate } = job.data;
    this.quoteEmitter.emitQuoteRequestedEvent(requestId, plate);

    for (const provider of this.providers) {
      await this.quoteQueueProducer.addProviderQuoteRequestJob({
        requestId,
        plate,
        provider,
      });
    }

    return { success: true, message: 'Quote request distributed to providers' };
  }
}
