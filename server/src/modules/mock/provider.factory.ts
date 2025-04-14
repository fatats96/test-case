import { Injectable } from '@nestjs/common';
import { CompanyA } from './CompanyA.provider';
import { CompanyB } from './CompanyB.provider';
import { CompanyC } from './CompanyC.provider';

@Injectable()
export class ProviderFactory {
  GetCompanyProvider(companyName: string) {
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
