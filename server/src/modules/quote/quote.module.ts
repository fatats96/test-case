import { Module } from '@nestjs/common';
import { QuoteService } from './quote.service';
import { QuoteController } from './quote.controller';
import { BullModule } from '@nestjs/bull';
import { ProviderFactory } from '../mock/provider.factory';
import { MongooseModule } from '@nestjs/mongoose';
import { Quote, QuoteSchema } from './schemas/quote.schema';
import { QuoteRequestListener } from './listeners/quote-request.listener';
import { QuotesProcessor } from './processors/quotes.processor';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'quotes' }),
    MongooseModule.forFeature([{ name: Quote.name, schema: QuoteSchema }]),
  ],
  providers: [
    QuoteService,
    ProviderFactory,
    QuoteRequestListener,
    QuotesProcessor,
  ],
  controllers: [QuoteController],
})
export class QuoteModule {}
