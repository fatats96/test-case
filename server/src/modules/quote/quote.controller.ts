import { Controller, Get, Query } from '@nestjs/common';
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
}
