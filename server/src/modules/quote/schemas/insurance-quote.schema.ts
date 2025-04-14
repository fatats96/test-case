import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class InsuranceQuoteSchema {
  @Prop({ required: true })
  provider: string;

  @Prop({ default: 0 })
  price: number;

  @Prop({ default: '' })
  coverageDetails: string;

  @Prop({ default: false })
  isSuccess: boolean;

  @Prop()
  errorMessage?: string;

  @Prop({ default: 'pending' })
  status: string;

  @Prop({ default: Date.now })
  timestamp?: Date;
}
