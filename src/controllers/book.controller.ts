import { plainToInstance } from 'class-transformer';
import { IsUUID } from 'class-validator';
import { Body, Get, HttpCode, JsonController, OnUndefined, Params, Post, ResponseClassTransformOptions } from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { Inject, Service } from 'typedi';

import { BookDto, NewBookDto } from '@dtos';
import { BookService } from '@services';

class BookParams {
  @IsUUID()
    id: string;
}

@Service()
@JsonController('/api/v1')
export class BookController {
  @Inject()
    bookService: BookService;

  @Get('/books')
  @ResponseSchema(BookDto, { isArray: true })
  @ResponseClassTransformOptions({ excludeExtraneousValues: true })
  async getAll (): Promise<BookDto[]> {
    const books: BookDto[] = await this.bookService.findAll();
    return plainToInstance(BookDto, books);
  }

  @Get('/books/:id')
  @OnUndefined(404)
  @ResponseSchema(BookDto)
  @ResponseClassTransformOptions({ excludeExtraneousValues: true })
  async getOne (
    @Params()
      params: BookParams
  ): Promise<BookDto | undefined> {
    const book = await this.bookService.findById(params.id);
    return plainToInstance(BookDto, book);
  }

  @Post('/books')
  @HttpCode(200)
  @ResponseSchema(BookDto)
  @ResponseClassTransformOptions({ excludeExtraneousValues: true })
  async signup (
    @Body({ required: true, validate: true, transform: { excludeExtraneousValues: true } }) payload: NewBookDto
  ): Promise<BookDto> {
    const newBook = await this.bookService.createOne(payload);
    return plainToInstance(BookDto, newBook);
  }
}
