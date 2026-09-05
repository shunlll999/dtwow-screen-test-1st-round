import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ConcertsService } from './concerts.service';

describe('ConcertsService', () => {
  let service: ConcertsService;
  let prisma: {
    concert: {
      findMany: jest.Mock;
      aggregate: jest.Mock;
      create: jest.Mock;
      delete: jest.Mock;
    };
    reservationLog: {
      count: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      concert: {
        findMany: jest.fn(),
        aggregate: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
      },
      reservationLog: {
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConcertsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(ConcertsService);
  });

  describe('findAll', () => {
    it('returns concerts ordered by name, including fully booked ones', async () => {
      const concerts = [
        { id: '1', name: 'A', reservedSeats: 3, totalSeats: 3 },
      ];
      prisma.concert.findMany.mockResolvedValue(concerts);

      const result = await service.findAll();

      expect(prisma.concert.findMany).toHaveBeenCalledWith({
        orderBy: { name: 'asc' },
      });
      expect(result).toBe(concerts);
    });
  });

  describe('stats', () => {
    it('summarises total seats, reserved seats and cancellations', async () => {
      prisma.concert.aggregate.mockResolvedValue({
        _sum: { totalSeats: 500, reservedSeats: 120 },
      });
      prisma.reservationLog.count.mockResolvedValue(12);

      const result = await service.stats();

      expect(prisma.reservationLog.count).toHaveBeenCalledWith({
        where: { action: 'CANCEL' },
      });
      expect(result).toEqual({ totalSeats: 500, reserved: 120, cancelled: 12 });
    });

    it('falls back to zero when there are no concerts', async () => {
      prisma.concert.aggregate.mockResolvedValue({
        _sum: { totalSeats: null, reservedSeats: null },
      });
      prisma.reservationLog.count.mockResolvedValue(0);

      await expect(service.stats()).resolves.toEqual({
        totalSeats: 0,
        reserved: 0,
        cancelled: 0,
      });
    });
  });

  describe('create', () => {
    it('creates a concert from the given dto', async () => {
      const dto = { name: 'Rock Night', description: 'Loud', totalSeats: 100 };
      const created = { id: '1', ...dto, reservedSeats: 0 };
      prisma.concert.create.mockResolvedValue(created);

      const result = await service.create(dto);

      expect(prisma.concert.create).toHaveBeenCalledWith({ data: dto });
      expect(result).toBe(created);
    });
  });

  describe('remove', () => {
    it('deletes the concert by id', async () => {
      prisma.concert.delete.mockResolvedValue({ id: '1' });

      await service.remove('1');

      expect(prisma.concert.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('throws NotFoundException when the concert does not exist', async () => {
      prisma.concert.delete.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Record not found', {
          code: 'P2025',
          clientVersion: '6.19.3',
        }),
      );

      await expect(service.remove('missing-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('rethrows unexpected errors', async () => {
      const unexpected = new Error('connection lost');
      prisma.concert.delete.mockRejectedValue(unexpected);

      await expect(service.remove('1')).rejects.toThrow(unexpected);
    });
  });
});
