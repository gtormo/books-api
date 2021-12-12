import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

import { Author } from './author.entity';

@Entity()
@Unique(['isbn'])
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  isbn: string;

  @Column()
  title: string;

  @Column()
  theme: string;

  @ManyToOne(() => Author, { nullable: false, onDelete: 'RESTRICT', eager: true })
  author: Author;

  @Column()
  year: number;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
