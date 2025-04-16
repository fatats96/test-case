import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { QuoteEventTypesEnum } from 'src/events/quote-events';
import { IInsuranceQuoteModel } from 'src/models/insurance-quote.model';

@Injectable()
export class QuoteEmitter {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  emitQuoteRequestedEvent(requestId: string, plate: string) {
    this.eventEmitter.emit(QuoteEventTypesEnum.QUOTE_REQUESTED, {
      requestId,
      plate,
      timestamp: new Date(),
    });
  }

  emitProviderQuoteRequestedEvent(
    requestId: string,
    provider: string,
    plate: string,
  ) {
    this.eventEmitter.emit(QuoteEventTypesEnum.PROVIDER_QUOTE_REQUESTED, {
      requestId,
      provider,
      plate,
      timestamp: new Date(),
    });
  }

  emitProviderQuoteCompletedEvent(
    requestId: string,
    provider: string,
    plate: string,
    quote: IInsuranceQuoteModel,
  ) {
    this.eventEmitter.emit(QuoteEventTypesEnum.PROVIDER_QUOTE_COMPLETED, {
      requestId,
      provider,
      plate,
      quote,
      timestamp: new Date(),
    });
  }

  emitProviderQuoteFailedEvent(
    requestId: string,
    provider: string,
    plate: string,
    error: string,
  ) {
    this.eventEmitter.emit(QuoteEventTypesEnum.PROVIDER_QUOTE_FAILED, {
      requestId,
      provider,
      plate,
      error,
      timestamp: new Date(),
    });
  }

  emitQuoteRecievedEvent(
    requestId: string,
    plate: string,
    quotes: IInsuranceQuoteModel[],
  ) {
    this.eventEmitter.emit(QuoteEventTypesEnum.QUOTE_RECIEVED, {
      requestId,
      quotes,
      plate,
      timestamp: new Date(),
    });
  }

  emitQuotePartiallyCompleted(
    requestId: string,
    plate: string,
    quotes: IInsuranceQuoteModel[],
  ) {
    this.eventEmitter.emit(QuoteEventTypesEnum.QUOTE_PARTIALLY_RECIEVED, {
      requestId,
      quotes,
      plate,
      timestamp: new Date(),
    });
  }
}
