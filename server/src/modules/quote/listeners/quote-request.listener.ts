import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Quote, QuoteDocument } from '../schemas/quote.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IInsuranceQuoteModel } from 'src/models/insurance-quote.model';

@Injectable()
export class QuoteRequestListener {
  constructor(
    @InjectModel(Quote.name) private quoteModel: Model<QuoteDocument>,
  ) {}

  @OnEvent('quote.request.completed')
  async handleQuoteRequestCompleted(data: {
    requestId: string;
    quote: IInsuranceQuoteModel;
  }) {
    console.log('I ll handle the data', data);
    await this.updateQuoteWithProviderResult(data.requestId, data.quote);
  }

  private async updateQuoteWithProviderResult(
    requestId: string,
    providerQuote: IInsuranceQuoteModel,
  ): Promise<void> {
    const quote = await this.quoteModel.findOne({ requestId }).exec();

    if (!quote) {
      console.log(`Quote not found for requestId: ${requestId}`);
      return;
    }

    const providerIndex = quote.quotes.findIndex(
      (q) => q.provider === providerQuote.provider,
    );

    if (providerIndex !== -1) {
      quote.quotes[providerIndex] = providerQuote;
    } else {
      quote.quotes.push(providerQuote);
    }

    quote.successCount = quote.quotes.filter((q) => q.isSuccess).length;
    quote.failureCount = quote.quotes.filter(
      (q) => q.status === 'failed',
    ).length;

    // Tüm quote'lar tamamlandıysa status'u 'completed' olarak işaretle
    const pendingQuotes = quote.quotes.filter(
      (q) => q.status === 'pending',
    ).length;
    if (pendingQuotes === 0) {
      quote.status = 'completed';
    }

    await quote.save();
  }
}
