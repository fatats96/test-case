import { IInsuranceQuoteModel } from '../../models/insurance-quote.model';

export interface IProvider {
  getProviderName(): string;
  getQuote(plate: string): Promise<IInsuranceQuoteModel>;
}
