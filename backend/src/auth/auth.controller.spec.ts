import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@prisma/client';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtPayload } from './types/jwt-payload.interface';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: { login: jest.Mock };

  beforeEach(async () => {
    authService = { login: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get(AuthController);
  });

  describe('login', () => {
    it('delegates credentials to AuthService.login', async () => {
      const expected = { accessToken: 'signed-jwt', user: { id: '1' } };
      authService.login.mockResolvedValue(expected);

      const result = await controller.login({
        email: 'admin@datawow.com',
        password: 'Admin@123',
      });

      expect(authService.login).toHaveBeenCalledWith({
        email: 'admin@datawow.com',
        password: 'Admin@123',
      });
      expect(result).toBe(expected);
    });
  });

  describe('getProfile', () => {
    it('returns the JWT payload attached by the guards', () => {
      const user: JwtPayload = {
        sub: 'user-id',
        email: 'user@datawow.com',
        role: Role.USER,
      };

      expect(controller.getProfile(user)).toBe(user);
    });
  });

  describe('adminOnly', () => {
    it('returns the expected welcome message for an ADMIN', () => {
      const admin: JwtPayload = {
        sub: 'admin-id',
        email: 'admin@datawow.com',
        role: Role.ADMIN,
      };

      expect(controller.adminOnly(admin)).toEqual({
        message: 'Welcome, admin admin@datawow.com',
      });
    });
  });
});
