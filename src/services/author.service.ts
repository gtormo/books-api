import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { Author } from '@db/entity';
import { AuthorDto, NewAuthorDto } from '@dtos';

@Service()
export default class AuthorService {
 @InjectRepository(Author)
   authorRepository: Repository<Author>;

 async findAll (): Promise<AuthorDto[]> {
   return this.authorRepository.find();
 }

 async findById (id: string): Promise<AuthorDto | undefined> {
   return this.authorRepository.findOne({ id });
 }

 async createOne (author: NewAuthorDto): Promise<NewAuthorDto> {
   return this.authorRepository.save(author);
 }
}
