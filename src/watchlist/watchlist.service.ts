import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { MoviesService } from '../movies/movies.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WatchlistService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly movieService: MoviesService,
  ) {}

  async toggle(movieId: UUID, userId: string) {
    await this.movieService.findOne(movieId);

    const existing = await this.prisma.watchlistItem.findUnique({
      where: { userId_movieId: { userId, movieId } },
    });

    if (existing) {
      await this.prisma.watchlistItem.delete({
        where: { userId_movieId: { userId, movieId } },
      });
      return { added: false };
    }

    await this.prisma.watchlistItem.create({
      data: { userId, movieId },
    });
    return { added: true };
  }

  async findAll(userId: string) {
    const items = await this.prisma.watchlistItem.findMany({
      where: { userId },
      select: {
        movie: true,
      },
    });
    return items.map((item) => item.movie);
  }
}
