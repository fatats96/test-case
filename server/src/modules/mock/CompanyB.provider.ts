export class CompanyB {
  getProviderName(): string {
    return 'Sigorta Şirketi B';
  }

  async getQuote(plate: string) {
    await new Promise((resolve) =>
      setTimeout(resolve, 500 + Math.random() * 2000),
    );

    if (Math.random() < 0.15) {
      return {
        provider: this.getProviderName(),
        price: 0,
        plate,
        coverageDetails: '',
        isSuccess: false,
        errorMessage: 'Servise şuan erişlemiyor',
        status: 'failed',
        timestamp: new Date(),
      };
    }

    return {
      plate,
      provider: this.getProviderName(),
      price: Math.floor(800 + Math.random() * 1500),
      coverageDetails: 'Kazalarını karşılayan tam paket (**Kısmi)',
      isSuccess: true,
      status: 'completed',
      timestamp: new Date(),
    };
  }
}
