import { IInsuranceQuoteModel } from './insurance-quote.model';

export interface IQuoteModel {
  _id?: string;
  requestId: string;
  plate: string;
  quotes: IInsuranceQuoteModel[];
  status: 'processing' | 'completed';
  successCount: number;
  failureCount: number;
  createdAt: Date;
  updatedAt: Date;
}
