import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QuoteCompletionJob, QuoteQueueNames } from 'src/queues/quote.queue';
import { Quote, QuoteDocument } from '../schemas/quote.schema';
import { QuoteEmitter } from '../emitters/quote.emitter';
import { IInsuranceQuoteModel } from 'src/models/insurance-quote.model';

@Processor(QuoteQueueNames.QUOTE_COMPLETION)
export class QuoteCompletionConsumer {
  constructor(
    @InjectModel(Quote.name) private quoteModel: Model<QuoteDocument>,
    private readonly quoteEmitter: QuoteEmitter,
  ) {}

  @Process('complete')
  async completeQuote(job: Job<QuoteCompletionJob>) {
    const { requestId, plate, providerResults } = job.data;

    const quote = await this.quoteModel.findOne({ requestId }).exec();

    if (!quote) {
      throw new Error(`Quote not found for requestId: ${requestId}`);
    }

    if (
      providerResults.success + providerResults.failure ===
      providerResults.total
    ) {
      quote.status = 'completed';
      await quote.save();

      this.quoteEmitter.emitQuoteRecievedEvent(
        requestId,
        plate,
        quote.quotes as IInsuranceQuoteModel[],
      );
    }

    return { success: true, status: quote.status };
  }
}
