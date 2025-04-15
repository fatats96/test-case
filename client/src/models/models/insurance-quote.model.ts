export interface IInsuranceQuoteModel {
  plate: string;
  provider: string;
  price: number;
  coverageDetails: string;
  isSuccess: boolean;
  errorMessage?: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp?: Date;
}
