/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { CreateQuoteDTO } from './Dtos/create-quote-dto';
import { InjectModel } from '@nestjs/mongoose';
import { Quote, QuoteDocument } from './schemas/quote.schema';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { IQuoteModel } from 'src/models/quote.model';
import { IInsuranceQuoteModel } from 'src/models/insurance-quote.model';
import { QuoteEmitter } from './emitters/quote.emitter';
import { QuotesProcessor } from './processors/quotes.processor';

@Injectable()
export class QuoteService {
  constructor(
    @InjectModel(Quote.name) private quoteModel: Model<QuoteDocument>,
    private quoteEmitter: QuoteEmitter,
    private quotesProcessor: QuotesProcessor,
  ) {}

  async processQuote(quoteQuery: CreateQuoteDTO) {
    const { plate } = quoteQuery;

    const requestId = uuidv4();
    const newQuote = new this.quoteModel({
      requestId,
      plate,
      status: 'processing',
      quotes: [
        { provider: 'Sigorta Şirketi A', status: 'pending' },
        { provider: 'Sigorta Şirketi B', status: 'pending' },
        { provider: 'Sigorta Şirketi C', status: 'pending' },
      ],
      successCount: 0,
      failureCount: 0,
    });
    await newQuote.save();

    void this.quotesProcessor.addQuoteProcessingJob({ requestId, plate });

    return {
      requestId,
      plate,
      status: 'processing',
      message: 'Teklif isteği alındı ve işleniyor',
      statusUrl: `/api/quote/status/${requestId}`,
    };
  }

  async getQuoteStatus(requestId: string) {
    const quote = await this.quoteModel.findOne({ requestId }).exec();

    if (!quote) {
      return null;
    }

    return this.mapQuoteDocumentToResponse(quote);
  }

  async getQuoteStatusByPlate(plate: string) {
    const quote = await this.quoteModel.findOne({ plate }).exec();

    if (!quote) {
      return null;
    }

    return this.mapQuoteDocumentToResponse(quote);
  }

  private mapQuoteDocumentToResponse(quote: QuoteDocument): IQuoteModel {
    const id = quote._id as string;

    return {
      _id: id.toString(),
      requestId: quote.requestId,
      plate: quote.plate,
      quotes: quote.quotes as IInsuranceQuoteModel[],
      status: quote.status as 'processing' | 'completed',
      successCount: quote.successCount,
      failureCount: quote.failureCount,
      createdAt: quote.createdAt,
      updatedAt: quote.updatedAt,
    };
  }
}
