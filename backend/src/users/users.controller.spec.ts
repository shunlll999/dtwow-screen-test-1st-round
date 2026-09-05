import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@prisma/client';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: { findAll: jest.Mock };

  beforeEach(async () => {
    usersService = { findAll: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersService }],
    }).compile();

    controller = module.get(UsersController);
  });

  describe('findAll', () => {
    it('delegates to UsersService.findAll', async () => {
      const users = [
        {
          id: '1',
          email: 'admin@datawow.com',
          name: 'Admin',
          role: Role.ADMIN,
          createdAt: new Date('2026-01-01'),
        },
      ];
      usersService.findAll.mockResolvedValue(users);

      await expect(controller.findAll()).resolves.toBe(users);
      expect(usersService.findAll).toHaveBeenCalled();
    });
  });
});
