import { Process, Processor } from '@nestjs/bull';
import { ProviderFactory } from 'src/modules/mock/provider.factory';
import { Job } from 'bull';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IProvider } from 'src/modules/mock/IProvider';
import { IInsuranceQuoteModel } from 'src/models/insurance-quote.model';

interface IQuoteJob {
  requestId: string;
  plate: string;
}

@Processor('quotes')
export class QuotesProcessor {
  private readonly insuranceProviders: (IProvider | null)[] = [];

  constructor(
    private readonly providerFactory: ProviderFactory,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.insuranceProviders = [
      providerFactory.GetCompanyProvider('Sigorta Şirketi A'),
      providerFactory.GetCompanyProvider('Sigorta Şirketi B'),
      providerFactory.GetCompanyProvider('Sigorta Şirketi C'),
    ];
  }

  @Process('get-quote')
  getQuote(job: Job<IQuoteJob>) {
    for (const provider of this.insuranceProviders) {
      const quote = provider?.getQuote(job.data.plate);

      quote
        ?.then(this.processSuccessfulQuote(job.data.requestId))
        .catch((error: Error) =>
          this.processFailedQuote(
            job.data.requestId,
            provider!.getProviderName(),
            error,
          ),
        );
    }

    return true;
  }

  private processSuccessfulQuote(requestId: string) {
    return (quote: IInsuranceQuoteModel) => {
      this.eventEmitter.emit('quote.request.completed', { requestId, quote });
    };
  }

  private processFailedQuote(
    requestId: string,
    provider: string,
    error: Error,
  ) {
    const failedQuote = {
      provider,
      price: 0,
      coverageDetails: '',
      isSuccess: false,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      errorMessage: `System error: ${error.message}`,
      status: 'failed',
      timestamp: new Date(),
    };
    this.eventEmitter.emit('quote.request.completed', {
      requestId,
      quote: failedQuote,
    });
  }
}
