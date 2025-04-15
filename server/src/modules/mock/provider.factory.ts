import { Injectable } from '@nestjs/common';
import { CompanyA } from './CompanyA.provider';
import { CompanyB } from './CompanyB.provider';
import { CompanyC } from './CompanyC.provider';
import { IProvider } from './IProvider';

@Injectable()
export class ProviderFactory {
  GetCompanyProvider(companyName: string): IProvider | null {
    switch (companyName) {
      case 'Sigorta Şirketi A':
        return new CompanyA();
      case 'Sigorta Şirketi B':
        return new CompanyB();
      case 'Sigorta Şirketi C':
        return new CompanyC();
      default:
        return null;
    }
  }
}
