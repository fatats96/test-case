export enum QuoteQueueNames {
  QUOTE_PROCESSING = 'quote-processing',
  PROVIDER_QUOTE_REQUEST = 'provider-quote-request',
  QUOTE_COMPLETION = 'quote-completion',
}

export interface QuoteProcessingJob {
  requestId: string;
  plate: string;
}

export interface ProviderQuoteRequestJob {
  requestId: string;
  plate: string;
  provider: string;
}

export interface QuoteCompletionJob {
  requestId: string;
  plate: string;
  providerResults: {
    success: number;
    failure: number;
    total: number;
  };
}
