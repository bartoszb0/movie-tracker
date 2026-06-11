import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UUID } from 'crypto';
import { Genre } from '../../generated/prisma/enums';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createMovieDto: CreateMovieDto, userId: string) {
    return this.prisma.movie.create({
      data: {
        title: createMovieDto.title,
        year: createMovieDto.year,
        director: createMovieDto.director,
        genre: createMovieDto.genre,
        addedById: userId,
      },
    });
  }

  findAll() {
    return this.prisma.movie.findMany();
  }

  findGenreMovies(genre: Genre) {
    return this.prisma.movie.findMany({
      where: {
        genre,
      },
    });
  }

  async findOne(id: UUID) {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
    });
    if (!movie) throw new NotFoundException();
    return movie;
  }

  async update(id: UUID, updateMovieDto: UpdateMovieDto, userId: string) {
    const movie = await this.findOne(id);

    if (movie.addedById !== userId) throw new ForbiddenException();

    return this.prisma.movie.update({
      where: { id },
      data: updateMovieDto,
    });
  }

  async remove(id: UUID, userId: string) {
    const movie = await this.findOne(id);

    if (movie.addedById !== userId) throw new ForbiddenException();

    return this.prisma.movie.delete({
      where: { id },
    });
  }
}
