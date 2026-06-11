import { IsIn, IsInt, IsString, Length, Max, Min } from 'class-validator';
import { Genre } from '../../../generated/prisma/enums';

export class CreateMovieDto {
  @IsString()
  @Length(1, 100)
  declare title: string;

  @IsInt()
  @Min(1888)
  @Max(new Date().getFullYear())
  declare year: number;

  @IsString()
  @Length(1, 100)
  declare director: string;

  @IsIn(Object.values(Genre))
  declare genre: Genre;
}
