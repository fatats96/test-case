import { IInsuranceQuoteModel } from 'src/models/insurance-quote.model';
import { IProvider } from './IProvider';

export class CompanyC implements IProvider {
  getProviderName(): string {
    return 'Sigorta Şirketi C';
  }

  async getQuote(plate: string): Promise<IInsuranceQuoteModel> {
    await new Promise((resolve) =>
      setTimeout(resolve, 500 + Math.random() * 13000),
    );
    console.log('resolving ', this.getProviderName());

    if (Math.random() < 0.3) {
      return {
        provider: this.getProviderName(),
        price: 0,
        plate,
        coverageDetails: '',
        isSuccess: false,
        errorMessage: 'Servise şuan erişilemiyor',
        status: 'failed',
        timestamp: new Date(),
      };
    }

    return {
      plate,
      provider: this.getProviderName(),
      price: Math.floor(800 + Math.random() * 2200),
      coverageDetails: 'VIP her şey dahil paket',
      isSuccess: true,
      status: 'completed',
      timestamp: new Date(),
    };
  }
}
