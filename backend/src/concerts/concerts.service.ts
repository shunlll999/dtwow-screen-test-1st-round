import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ReservationAction } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConcertDto } from './dto/create-concert.dto';

@Injectable()
export class ConcertsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.concert.findMany({ orderBy: { name: 'asc' } });
  }

  async stats() {
    const [seats, cancelled] = await Promise.all([
      this.prisma.concert.aggregate({
        _sum: { totalSeats: true, reservedSeats: true },
      }),
      this.prisma.reservationLog.count({
        where: { action: ReservationAction.CANCEL },
      }),
    ]);

    return {
      totalSeats: seats._sum.totalSeats ?? 0,
      reserved: seats._sum.reservedSeats ?? 0,
      cancelled,
    };
  }

  create(dto: CreateConcertDto) {
    return this.prisma.concert.create({ data: dto });
  }

  async remove(id: string) {
    try {
      await this.prisma.concert.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Concert not found');
      }
      throw error;
    }
  }
}
