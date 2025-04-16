import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Quote, QuoteDocument } from '../schemas/quote.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ProviderFactory } from 'src/modules/mock/provider.factory';
import { QuoteEmitter } from '../emitters/quote.emitter';
import {
  IQuoteRequestedEvent,
  QuoteEventTypesEnum,
} from 'src/events/quote-events';

@Injectable()
export class QuoteRequestListener {
  private readonly companyNames = [
    'Sigorta Şirketi A',
    'Sigorta Şirketi B',
    'Sigorta Şirketi C',
  ];

  constructor(
    @InjectModel(Quote.name) private quoteModel: Model<QuoteDocument>,
    private readonly providerFactory: ProviderFactory,
    private readonly quoteEmitter: QuoteEmitter,
  ) {}

  @OnEvent(QuoteEventTypesEnum.QUOTE_REQUESTED)
  handleQuoteRequested(event: IQuoteRequestedEvent) {
    for (const companyName of this.companyNames) {
      this.quoteEmitter.emitProviderQuoteRequestedEvent(
        event.requestId,
        companyName,
        event.plate,
      );
    }
  }
}
