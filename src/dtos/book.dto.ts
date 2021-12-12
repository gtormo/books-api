import { Expose, Type } from 'class-transformer';
import { IsNumber, IsString, IsUUID, ValidateNested } from 'class-validator';

import { AuthorDto } from './author.dto';

export class NewBookDto {
    @Expose()
    @IsUUID()
      isbn: string;

    @Expose()
    @IsString()
      title: string;

    @Expose()
    @IsString()
      theme: string;

    @Expose()
    @IsNumber()
      year: number;

    @Expose()
    @ValidateNested()
    @Type(() => AuthorDto)
      author: AuthorDto;
}

export class BookDto extends NewBookDto {
    @Expose()
    @IsUUID()
      id: string;
}
