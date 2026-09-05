import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@prisma/client';
import request from 'supertest';
import { App } from 'supertest/types';
import { AuthModule } from '../src/auth/auth.module';
import { PrismaModule } from '../src/prisma/prisma.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;
  let jwtService: JwtService;

  const mockPrismaService = {
    user: { findUnique: jest.fn() },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        PrismaModule,
        AuthModule,
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();

    jwtService = moduleFixture.get(JwtService);
  });

  afterAll(async () => {
    await app.close();
  });

  const tokenFor = (role: Role, email: string) =>
    jwtService.sign({ sub: `${role}-id`, email, role });

  describe('GET /auth/admin-only', () => {
    it('200s with the welcome message for an ADMIN token', async () => {
      const token = tokenFor(Role.ADMIN, 'admin@datawow.com');

      const res = await request(app.getHttpServer())
        .get('/auth/admin-only')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toEqual({
        message: 'Welcome, admin admin@datawow.com',
      });
    });

    it('403s a USER token', async () => {
      const token = tokenFor(Role.USER, 'user@datawow.com');

      const res = await request(app.getHttpServer())
        .get('/auth/admin-only')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);

      expect((res.body as { message: string }).message).toBe(
        'You do not have permission to access this resource',
      );
    });

    it('401s when no token is provided', async () => {
      const res = await request(app.getHttpServer())
        .get('/auth/admin-only')
        .expect(401);

      expect((res.body as { message: string }).message).toBe('Unauthorized');
    });

    it('401s an expired token', async () => {
      const expiredToken = jwtService.sign(
        { sub: 'admin-id', email: 'admin@datawow.com', role: Role.ADMIN },
        { expiresIn: -1 },
      );

      await request(app.getHttpServer())
        .get('/auth/admin-only')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);
    });
  });
});
