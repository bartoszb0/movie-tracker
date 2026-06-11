import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { MoviesModule } from './movies/movies.module';
import { WatchlistModule } from './watchlist/watchlist.module';

@Module({
  imports: [PrismaModule, AuthModule, MoviesModule, WatchlistModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
