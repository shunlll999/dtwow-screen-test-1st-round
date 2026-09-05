import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, ReservationAction } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReservationsService {
  constructor(private readonly prisma: PrismaService) {}

  reserve(userId: string, concertId: string) {
    return this.prisma.$transaction(async (tx) => {
      const concert = await tx.concert.findUnique({
        where: { id: concertId },
      });
      if (!concert) {
        throw new NotFoundException('Concert not found');
      }

      const claimed = await tx.concert.updateMany({
        where: { id: concertId, reservedSeats: { lt: concert.totalSeats } },
        data: { reservedSeats: { increment: 1 } },
      });
      if (claimed.count === 0) {
        throw new ConflictException('This concert is fully booked');
      }

      try {
        await tx.reservation.create({ data: { userId, concertId } });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          throw new ConflictException(
            'You already have a reservation for this concert',
          );
        }
        throw error;
      }

      return tx.reservationLog.create({
        data: {
          userId,
          concertId,
          concertName: concert.name,
          action: ReservationAction.RESERVE,
        },
      });
    });
  }

  cancel(userId: string, concertId: string) {
    return this.prisma.$transaction(async (tx) => {
      const reservation = await tx.reservation.findUnique({
        where: { userId_concertId: { userId, concertId } },
      });
      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      const concert = await tx.concert.findUnique({
        where: { id: concertId },
      });

      await tx.reservation.delete({ where: { id: reservation.id } });
      await tx.concert.update({
        where: { id: concertId },
        data: { reservedSeats: { decrement: 1 } },
      });

      return tx.reservationLog.create({
        data: {
          userId,
          concertId,
          concertName: concert?.name ?? 'Unknown concert',
          action: ReservationAction.CANCEL,
        },
      });
    });
  }

  findMyHistory(userId: string) {
    return this.prisma.reservationLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  findAllHistory() {
    return this.prisma.reservationLog.findMany({
      include: { user: { select: { id: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
