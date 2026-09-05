import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { JwtPayload } from '../auth/types/jwt-payload.interface';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationsService } from './reservations.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Roles(Role.USER)
  @Post()
  reserve(@CurrentUser() user: JwtPayload, @Body() dto: CreateReservationDto) {
    return this.reservationsService.reserve(user.sub, dto.concertId);
  }

  @Roles(Role.USER)
  @Delete(':concertId')
  cancel(
    @CurrentUser() user: JwtPayload,
    @Param('concertId', ParseUUIDPipe) concertId: string,
  ) {
    return this.reservationsService.cancel(user.sub, concertId);
  }

  @Roles(Role.USER)
  @Get('me')
  findMyHistory(@CurrentUser() user: JwtPayload) {
    return this.reservationsService.findMyHistory(user.sub);
  }

  @Roles(Role.ADMIN)
  @Get('audit')
  findAllHistory() {
    return this.reservationsService.findAllHistory();
  }
}
