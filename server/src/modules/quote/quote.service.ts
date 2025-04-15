/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { CreateQuoteDTO } from './Dtos/create-quote-dto';
import { InjectModel } from '@nestjs/mongoose';
import { Quote, QuoteDocument } from './schemas/quote.schema';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { IQuoteModel } from 'src/models/quote.model';
import { IInsuranceQuoteModel } from 'src/models/insurance-quote.model';

@Injectable()
export class QuoteService {
  constructor(
    @InjectModel(Quote.name) private quoteModel: Model<QuoteDocument>,
    @InjectQueue('quotes')
    private quotesQueue: Queue<{
      requestId: string;
      plate: string;
    }>,
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

    void this.quotesQueue.add('get-quote', {
      requestId,
      plate,
    });

    return this.mapQuoteDocumentToResponse(newQuote);
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
