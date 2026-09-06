import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma, ReservationAction } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ReservationsService } from './reservations.service';

describe('ReservationsService', () => {
  let service: ReservationsService;
  let tx: {
    concert: {
      findUnique: jest.Mock;
      updateMany: jest.Mock;
      update: jest.Mock;
    };
    reservation: {
      create: jest.Mock;
      findUnique: jest.Mock;
      delete: jest.Mock;
    };
    reservationLog: { create: jest.Mock };
  };
  let prisma: {
    $transaction: jest.Mock;
    reservationLog: { findMany: jest.Mock };
  };

  beforeEach(async () => {
    tx = {
      concert: {
        findUnique: jest.fn(),
        updateMany: jest.fn(),
        update: jest.fn(),
      },
      reservation: {
        create: jest.fn(),
        findUnique: jest.fn(),
        delete: jest.fn(),
      },
      reservationLog: { create: jest.fn() },
    };

    prisma = {
      $transaction: jest.fn((callback: (tx: unknown) => unknown) =>
        callback(tx),
      ),
      reservationLog: { findMany: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(ReservationsService);
  });

  describe('reserve', () => {
    const concert = { id: 'concert-1', name: 'Rock Night', totalSeats: 100 };

    it('throws NotFoundException when the concert does not exist', async () => {
      tx.concert.findUnique.mockResolvedValue(null);

      await expect(service.reserve('user-1', 'concert-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws ConflictException when the concert is fully booked', async () => {
      tx.concert.findUnique.mockResolvedValue(concert);
      tx.concert.updateMany.mockResolvedValue({ count: 0 });

      await expect(service.reserve('user-1', 'concert-1')).rejects.toThrow(
        ConflictException,
      );
      expect(tx.concert.updateMany).toHaveBeenCalledWith({
        where: { id: 'concert-1', reservedSeats: { lt: 100 } },
        data: { reservedSeats: { increment: 1 } },
      });
      expect(tx.reservation.create).not.toHaveBeenCalled();
    });

    it('throws ConflictException when the user already reserved this concert', async () => {
      tx.concert.findUnique.mockResolvedValue(concert);
      tx.concert.updateMany.mockResolvedValue({ count: 1 });
      tx.reservation.create.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
          code: 'P2002',
          clientVersion: '6.19.3',
        }),
      );

      await expect(service.reserve('user-1', 'concert-1')).rejects.toThrow(
        ConflictException,
      );
    });

    it('creates a reservation and logs the action on success', async () => {
      tx.concert.findUnique.mockResolvedValue(concert);
      tx.concert.updateMany.mockResolvedValue({ count: 1 });
      tx.reservation.create.mockResolvedValue({ id: 'res-1' });
      tx.reservationLog.create.mockResolvedValue({ id: 'log-1' });

      await service.reserve('user-1', 'concert-1');

      expect(tx.reservation.create).toHaveBeenCalledWith({
        data: { userId: 'user-1', concertId: 'concert-1' },
      });
      expect(tx.reservationLog.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          concertId: 'concert-1',
          concertName: 'Rock Night',
          action: ReservationAction.RESERVE,
        },
      });
    });
  });

  describe('cancel', () => {
    it('throws NotFoundException when no reservation exists', async () => {
      tx.reservation.findUnique.mockResolvedValue(null);

      await expect(service.cancel('user-1', 'concert-1')).rejects.toThrow(
        NotFoundException,
      );
      expect(tx.reservation.delete).not.toHaveBeenCalled();
    });

    it('deletes the reservation, frees the seat, and logs the cancellation', async () => {
      tx.reservation.findUnique.mockResolvedValue({
        id: 'res-1',
        userId: 'user-1',
        concertId: 'concert-1',
      });
      tx.concert.findUnique.mockResolvedValue({
        id: 'concert-1',
        name: 'Rock Night',
      });

      await service.cancel('user-1', 'concert-1');

      expect(tx.reservation.delete).toHaveBeenCalledWith({
        where: { id: 'res-1' },
      });
      expect(tx.concert.update).toHaveBeenCalledWith({
        where: { id: 'concert-1' },
        data: { reservedSeats: { decrement: 1 } },
      });
      expect(tx.reservationLog.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          concertId: 'concert-1',
          concertName: 'Rock Night',
          action: ReservationAction.CANCEL,
        },
      });
    });
  });

  describe('findMyHistory', () => {
    it('returns only the given user log entries, newest first', async () => {
      const logs = [{ id: 'log-1', userId: 'user-1' }];
      prisma.reservationLog.findMany.mockResolvedValue(logs);

      const result = await service.findMyHistory('user-1');

      expect(prisma.reservationLog.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toBe(logs);
    });
  });

  describe('findAllHistory', () => {
    it('returns every log entry with the acting user attached', async () => {
      const logs = [{ id: 'log-1', user: { id: 'user-1' } }];
      prisma.reservationLog.findMany.mockResolvedValue(logs);

      const result = await service.findAllHistory();

      expect(prisma.reservationLog.findMany).toHaveBeenCalledWith({
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toBe(logs);
    });
  });
});
