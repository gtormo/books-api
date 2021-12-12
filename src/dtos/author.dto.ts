import { Expose } from 'class-transformer';
import { IsString, IsUUID } from 'class-validator';

export class NewAuthorDto {
    @Expose()
    @IsString()
    name: string;

    @Expose()
    @IsString()
    surnames: string;

    @Expose()
    @IsString()
    gender: string;
}

export class AuthorDto extends NewAuthorDto {
    @Expose()
    @IsUUID()
    id: string;
}
