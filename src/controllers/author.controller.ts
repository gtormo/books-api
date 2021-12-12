import { plainToInstance } from 'class-transformer';
import { IsUUID } from 'class-validator';
import { Body, Get, HttpCode, JsonController, OnUndefined, Params, Post, ResponseClassTransformOptions } from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { Inject, Service } from 'typedi';

import { AuthorDto, NewAuthorDto } from '@dtos';
import { AuthorService } from '@services';

class AuthorParams {
  @IsUUID()
    id: string;
}

@Service()
@JsonController('/api/v1')
export class AuthorController {
  @Inject()
    authorService: AuthorService;

  @Get('/authors')
  @ResponseSchema(AuthorDto, { isArray: true })
  @ResponseClassTransformOptions({ excludeExtraneousValues: true })
  async getAll (): Promise<AuthorDto[]> {
    const authors: AuthorDto[] = await this.authorService.findAll();
    return plainToInstance(AuthorDto, authors);
  }

  @Get('/authors/:id')
  @OnUndefined(404)
  @ResponseSchema(AuthorDto)
  @ResponseClassTransformOptions({ excludeExtraneousValues: true })
  async getOne (
    @Params()
      params: AuthorParams
  ): Promise<AuthorDto | undefined> {
    const author = await this.authorService.findById(params.id);
    return plainToInstance(AuthorDto, author);
  }

  @Post('/authors')
  @HttpCode(200)
  @ResponseSchema(AuthorDto)
  @ResponseClassTransformOptions({ excludeExtraneousValues: true })
  async signup (
    @Body({ required: true, validate: true, transform: { excludeExtraneousValues: true } }) payload: NewAuthorDto
  ): Promise<AuthorDto> {
    const newAuthor = await this.authorService.createOne(payload);
    return plainToInstance(AuthorDto, newAuthor);
  }
}
