import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseEnumPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import type { UUID } from 'crypto';
import { Genre } from '../../generated/prisma/enums';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { UserPayload } from '../common/types/user-payload.type';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @UseGuards(JwtGuard)
  create(
    @Body() createMovieDto: CreateMovieDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.moviesService.create(createMovieDto, user.id);
  }

  @Get()
  findAll() {
    return this.moviesService.findAll();
  }

  @Get('genres')
  getGenres() {
    return Object.values(Genre);
  }

  @Get(':genre')
  findGenreMovies(@Param('genre', new ParseEnumPipe(Genre)) genre: Genre) {
    return this.moviesService.findGenreMovies(genre);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: UUID) {
    return this.moviesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateMovieDto: UpdateMovieDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.moviesService.update(id, updateMovieDto, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id', ParseUUIDPipe) id: UUID,
    @CurrentUser() user: UserPayload,
  ) {
    return this.moviesService.remove(id, user.id);
  }
}
