import { Controller, Get, Param, Query } from '@nestjs/common';
import { CreateQuoteDTO } from './Dtos/create-quote-dto';
import { ApiOperation } from '@nestjs/swagger';
import { QuoteService } from './quote.service';

@Controller('quote')
export class QuoteController {
  constructor(private readonly quoteService: QuoteService) {}

  @Get()
  @ApiOperation({ summary: 'Araç plakası ile sigorta tekliflerini başlatır' })
  CreateQuoteQuery(@Query() quoteQuery: CreateQuoteDTO) {
    return this.quoteService.processQuote(quoteQuery);
  }

  @Get('status/:requestId')
  @ApiOperation({
    summary: 'İstek Numarasına Göre Teklif durumu',
    parameters: [
      {
        name: 'requestId',
        in: 'path',
        description: 'İstenilen Teklif İçin Kullanılan RequestId',
      },
    ],
  })
  getQuoteStatus(@Param('requestId') requestId: string) {
    return this.quoteService.getQuoteStatus(requestId);
  }

  @Get('statusByPlate/:plate')
  @ApiOperation({
    summary: 'Plakasına Göre Teklif durumu',
    parameters: [
      {
        name: 'plate',
        in: 'path',
        description: 'İstenilen Teklif İçin Kullanılan Plaka',
      },
    ],
  })
  getQuoteStatusByPlate(@Param('plate') plate: string) {
    return this.quoteService.getQuoteStatusByPlate(plate);
  }
}
