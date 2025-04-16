import { Injectable } from '@nestjs/common';
import { QuoteEmitter } from '../emitters/quote.emitter';
import { ProviderFactory } from 'src/modules/mock/provider.factory';
import { OnEvent } from '@nestjs/event-emitter';
import {
  IProviderQuoteRequestedEvent,
  QuoteEventTypesEnum,
} from 'src/events/quote-events';

@Injectable()
export class CompanyQuoteRequestedListener {
  constructor(
    private readonly quoteEmitter: QuoteEmitter,
    private readonly providerFactory: ProviderFactory,
  ) {}

  @OnEvent(QuoteEventTypesEnum.PROVIDER_QUOTE_REQUESTED)
  async handleCompanyQuoteRequested(event: IProviderQuoteRequestedEvent) {
    const provider = this.providerFactory.GetCompanyProvider(event.provider);
    if (!provider) {
      this.quoteEmitter.emitProviderQuoteFailedEvent(
        event.requestId,
        event.provider,
        event.plate,
        'Provider not found',
      );

      return false;
    }

    try {
      const quote = await provider.getQuote(event.plate);
      this.quoteEmitter.emitProviderQuoteCompletedEvent(
        event.requestId,
        event.provider,
        event.plate,
        quote,
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      this.quoteEmitter.emitProviderQuoteFailedEvent(
        event.requestId,
        event.provider,
        event.plate,
        errorMessage,
      );
    }
  }
}
