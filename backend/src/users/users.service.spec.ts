import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

jest.mock('bcryptjs');

describe('UsersService', () => {
  let service: UsersService;
  let prisma: {
    user: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      user: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get(UsersService);

    jest.clearAllMocks();
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
  });

  describe('create', () => {
    const dto: CreateUserDto = {
      email: 'user@datawow.com',
      name: 'Test User',
      password: 'Password1',
    };

    it('hashes the password and creates the user, without leaking the hash', async () => {
      const createdUser = {
        id: '1',
        email: dto.email,
        name: dto.name,
        passwordHash: 'hashed-password',
        role: Role.USER,
        createdAt: new Date('2026-01-01'),
      };
      prisma.user.create.mockResolvedValue(createdUser);

      const result = await service.create(dto);

      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: dto.email,
          name: dto.name,
          passwordHash: 'hashed-password',
          role: dto.role,
        },
      });
      expect(result).toEqual({
        id: createdUser.id,
        email: createdUser.email,
        name: createdUser.name,
        role: createdUser.role,
        createdAt: createdUser.createdAt,
      });
      expect(result).not.toHaveProperty('passwordHash');
    });

    it('throws ConflictException when the email is already in use', async () => {
      prisma.user.create.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
          code: 'P2002',
          clientVersion: '6.19.3',
        }),
      );

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('rethrows unexpected errors', async () => {
      const unexpected = new Error('connection lost');
      prisma.user.create.mockRejectedValue(unexpected);

      await expect(service.create(dto)).rejects.toThrow(unexpected);
    });
  });

  describe('findAll', () => {
    it('returns users ordered by createdAt, excluding the password hash', async () => {
      const users = [{ id: '1', email: 'user@datawow.com', name: 'Test' }];
      prisma.user.findMany.mockResolvedValue(users);

      const result = await service.findAll();

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'asc' },
      });
      expect(result).toBe(users);
    });
  });

  describe('findByEmail', () => {
    it('finds a user by email', async () => {
      await service.findByEmail('user@datawow.com');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'user@datawow.com' },
      });
    });
  });

  describe('findById', () => {
    it('finds a user by id', async () => {
      await service.findById('user-1');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' },
      });
    });
  });
});
