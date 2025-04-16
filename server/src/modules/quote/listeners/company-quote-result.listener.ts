import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Quote } from '../schemas/quote.schema';
import { Model } from 'mongoose';
import { OnEvent } from '@nestjs/event-emitter';
import {
  IProviderQuoteCompletedEvent,
  IProviderQuoteFailedEvent,
  QuoteEventTypesEnum,
} from 'src/events/quote-events';
import { IInsuranceQuoteModel } from 'src/models/insurance-quote.model';
import { QuotesProcessor } from '../processors/quotes.processor';

@Injectable()
export class CompanyQuoteResultListener {
  constructor(
    @InjectModel(Quote.name) private quoteModel: Model<Quote>,
    private readonly quotesProcessor: QuotesProcessor,
  ) {}

  @OnEvent(QuoteEventTypesEnum.PROVIDER_QUOTE_COMPLETED)
  async handleCompanyQuoteCompleted(event: IProviderQuoteCompletedEvent) {
    await this.updateQuoteWithProviderResult(event.requestId, event.quote);
  }

  @OnEvent(QuoteEventTypesEnum.PROVIDER_QUOTE_FAILED)
  async handleCompanyQuoteFailed(event: IProviderQuoteFailedEvent) {
    const failedQuote = {
      provider: event.provider,
      price: 0,
      plate: event.plate,
      coverageDetails: '',
      isSuccess: false,
      errorMessage: event.error,
      status: 'failed',
      timestamp: new Date(),
    } as IInsuranceQuoteModel;

    await this.updateQuoteWithProviderResult(event.requestId, failedQuote);
  }

  private async updateQuoteWithProviderResult(
    requestId: string,
    providerQuote: IInsuranceQuoteModel,
  ): Promise<void> {
    const quote = await this.quoteModel.findOne({ requestId }).exec();

    if (!quote) {
      return;
    }

    const providerIndex = quote.quotes.findIndex(
      (q) => q.provider === providerQuote.provider,
    );

    if (providerIndex !== -1) {
      quote.quotes[providerIndex] = providerQuote;
    }

    const successCount = quote.quotes.filter((q) => q.isSuccess).length;
    const failureCount = quote.quotes.filter(
      (q) => q.status === 'failed',
    ).length;

    const totalProviders = quote.quotes.length;

    if (successCount + failureCount === totalProviders) {
      await this.quotesProcessor.addQuoteCompletionJob({
        requestId,
        plate: quote.plate,
        providerResults: {
          success: successCount,
          failure: failureCount,
          total: totalProviders,
        },
      });
    }
    await quote.save();
  }
}
