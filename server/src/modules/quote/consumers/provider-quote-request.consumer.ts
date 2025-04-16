import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ProviderFactory } from 'src/modules/mock/provider.factory';
import {
  ProviderQuoteRequestJob,
  QuoteQueueNames,
} from 'src/queues/quote.queue';
import { QuoteEmitter } from '../emitters/quote.emitter';

@Processor(QuoteQueueNames.PROVIDER_QUOTE_REQUEST)
export class ProviderQuoteRequestConsumer {
  constructor(
    private readonly providerFactory: ProviderFactory,
    private readonly quoteEmitter: QuoteEmitter,
  ) {}

  @Process('request')
  async requestProviderQuote(job: Job<ProviderQuoteRequestJob>) {
    const { requestId, plate, provider } = job.data;

    this.quoteEmitter.emitProviderQuoteRequestedEvent(
      requestId,
      plate,
      provider,
    );

    try {
      const providerInstance =
        this.providerFactory.GetCompanyProvider(provider);

      if (!providerInstance) {
        this.quoteEmitter.emitProviderQuoteFailedEvent(
          requestId,
          plate,
          provider,
          'Şirket bulunamadı',
        );
        return { success: false, message: 'Şirket bulunamadı' };
      }

      const quote = await providerInstance.getQuote(plate);

      this.quoteEmitter.emitProviderQuoteCompletedEvent(
        requestId,
        plate,
        provider,
        quote,
      );

      return { success: true, provider, quote };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      this.quoteEmitter.emitProviderQuoteFailedEvent(
        requestId,
        plate,
        provider,
        errorMessage,
      );

      throw new Error(
        `Failed to get quote from provider ${provider}: ${errorMessage}`,
      );
    }
  }
}
