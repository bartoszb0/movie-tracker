import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import type { UUID } from 'crypto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { UserPayload } from '../common/types/user-payload.type';
import { WatchlistService } from './watchlist.service';

@Controller('watchlist')
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Post(':id')
  @UseGuards(JwtGuard)
  toggle(
    @Param('id', ParseUUIDPipe) movieId: UUID,
    @CurrentUser() user: UserPayload,
  ) {
    return this.watchlistService.toggle(movieId, user.id);
  }

  @Get()
  @UseGuards(JwtGuard)
  findAll(@CurrentUser() user: UserPayload) {
    return this.watchlistService.findAll(user.id);
  }
}
