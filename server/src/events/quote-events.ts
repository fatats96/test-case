import { IInsuranceQuoteModel } from 'src/models/insurance-quote.model';

export enum QuoteEventTypesEnum {
  QUOTE_REQUESTED = 'quote.requested',
  PROVIDER_QUOTE_REQUESTED = 'provider.quote.requested',
  PROVIDER_QUOTE_COMPLETED = 'provider.quote.completed',
  PROVIDER_QUOTE_FAILED = 'provider.quote.failed',
  QUOTE_RECIEVED = 'quote.recieved',
  QUOTE_PARTIALLY_RECIEVED = 'quote.partially.recieved',
}

export interface IQuoteRequestedEvent {
  requestId: string;
  plate: string;
  timestamp: Date;
}

export interface IProviderQuoteRequestedEvent extends IQuoteRequestedEvent {
  provider: string;
}

export interface IProviderQuoteCompletedEvent
  extends IProviderQuoteRequestedEvent {
  quote: IInsuranceQuoteModel;
}

export interface IProviderQuoteFailedEvent
  extends IProviderQuoteRequestedEvent {
  error: string;
}

export interface IQuoteReceivedEvent extends IQuoteRequestedEvent {
  quotes: IInsuranceQuoteModel[];
}
