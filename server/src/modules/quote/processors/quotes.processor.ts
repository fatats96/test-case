import { Process, Processor } from '@nestjs/bull';
import { ProviderFactory } from 'src/modules/mock/provider.factory';
import { QuoteService } from '../quote.service';
import { Job } from 'bull';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Processor('quotes')
export class QuotesProcessor {
  constructor(
    private readonly providerFactory: ProviderFactory,
    private readonly quoteService: QuoteService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Process('get-quote')
  async getQuote(
    job: Job<{ requestId: string; plate: string; provider: string }>,
  ) {
    const companyAInstance = this.providerFactory.GetCompanyProvider(
      job.data.provider,
    );
    console.log('processing');
    try {
      const quote = await companyAInstance?.getQuote(job.data.plate);

      this.eventEmitter.emit('quote.request.completed', {
        requestId: job.data.requestId,
        quote,
      });

      return quote;
    } catch (error) {
      const failedQuote = {
        provider: companyAInstance?.getProviderName(),
        price: 0,
        coverageDetails: '',
        isSuccess: false,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        errorMessage: `System error: ${error.message}`,
        status: 'failed',
        timestamp: new Date(),
      };

      this.eventEmitter.emit('quote.request.completed', failedQuote);

      throw error;
    }
  }
}
