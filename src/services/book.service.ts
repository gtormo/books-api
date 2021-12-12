import { Inject, Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { Book } from '@db/entity';
import { BookDto, NewBookDto } from '@dtos';
import { AuthorService } from '@services';

@Service()
export default class BookService {
 @InjectRepository(Book)
 bookRepository: Repository<Book>;

 @Inject()
 authorService: AuthorService

 async findAll (): Promise<BookDto[]> {
   return this.bookRepository.find();
 }

 async findById (id: string): Promise<BookDto | undefined> {
   return this.bookRepository.findOne({ id });
 }

 async createOne (book: NewBookDto): Promise<NewBookDto> {
   await this.authorService.createOne(book?.author);
   return this.bookRepository.save(book);
 }
}
