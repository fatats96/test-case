export class CompanyA {
  getProviderName(): string {
    return 'Sigorta Şirketi A';
  }

  async getQuote(plate: string) {
    await new Promise((resolve) =>
      setTimeout(resolve, 500 + Math.random() * 1000),
    );

    if (Math.random() < 0.2) {
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
      price: Math.floor(800 + Math.random() * 500),
      coverageDetails: 'Yol yardımlı tam paket',
      isSuccess: true,
      status: 'completed',
      timestamp: new Date(),
    };
  }
}
