import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { InsuranceQuoteSchema } from './insurance-quote.schema';

export type QuoteDocument = Quote & Document;

@Schema({ timestamps: true })
export class Quote {
  @Prop({ required: true, unique: true })
  requestId: string;

  @Prop({ required: true })
  plate: string;

  @Prop({ type: [InsuranceQuoteSchema], default: [] })
  quotes: InsuranceQuoteSchema[];

  @Prop({ default: 'processing' })
  status: string;

  @Prop({ default: 0 })
  successCount: number;

  @Prop({ default: 0 })
  failureCount: number;

  createdAt: Date;
  updatedAt: Date;
}

export const QuoteSchema = SchemaFactory.createForClass(Quote);
