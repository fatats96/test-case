import { Module } from '@nestjs/common';
import { QuoteService } from './quote.service';
import { QuoteController } from './quote.controller';
import { BullModule } from '@nestjs/bull';
import { ProviderFactory } from '../mock/provider.factory';
import { MongooseModule } from '@nestjs/mongoose';
import { Quote, QuoteSchema } from './schemas/quote.schema';
import { QuoteRequestListener } from './listeners/quote-request.listener';
import { QuotesProcessor } from './processors/quotes.processor';
import { QuoteEmitter } from './emitters/quote.emitter';
import { CompanyQuoteRequestedListener } from './listeners/company-quote-requested.listener';
import { CompanyQuoteResultListener } from './listeners/company-quote-result.listener';
import { QuoteQueueNames } from 'src/queues/quote.queue';
import { ProviderQuoteRequestConsumer } from './consumers/provider-quote-request.consumer';
import { QuoteCompletionConsumer } from './consumers/quote.consumer';
import { QuoteProcessingConsumer } from './consumers/quote-completed.consumer';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: QuoteQueueNames.QUOTE_PROCESSING },
      { name: QuoteQueueNames.PROVIDER_QUOTE_REQUEST },
      { name: QuoteQueueNames.QUOTE_COMPLETION },
    ),
    MongooseModule.forFeature([{ name: Quote.name, schema: QuoteSchema }]),
  ],
  providers: [
    QuoteService,
    ProviderFactory,
    QuoteEmitter,
    QuotesProcessor,
    QuoteRequestListener,
    CompanyQuoteRequestedListener,
    CompanyQuoteResultListener,
    ProviderQuoteRequestConsumer,
    QuoteCompletionConsumer,
    QuoteProcessingConsumer,
  ],
  controllers: [QuoteController],
})
export class QuoteModule {}
