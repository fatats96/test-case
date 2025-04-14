/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';

export class CreateQuoteDTO {
  @ApiProperty({
    type: String,
    required: true,
    example: '34ABC123',
    description: 'Araç plakası',
  })
  @IsNotEmpty()
  @Matches(/^[0-9]{2}[A-Z]{1,3}[0-9]{1,4}$/, {
    message: 'Geçersiz plaka formatı',
  })
  plate: string;
}
