import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@prisma/client';
import { JwtPayload } from '../auth/types/jwt-payload.interface';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';

describe('ReservationsController', () => {
  let controller: ReservationsController;
  let reservationsService: {
    reserve: jest.Mock;
    cancel: jest.Mock;
    findMyHistory: jest.Mock;
    findAllHistory: jest.Mock;
  };

  const user: JwtPayload = {
    sub: 'user-1',
    email: 'user@datawow.com',
    role: Role.USER,
  };

  beforeEach(async () => {
    reservationsService = {
      reserve: jest.fn(),
      cancel: jest.fn(),
      findMyHistory: jest.fn(),
      findAllHistory: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationsController],
      providers: [
        { provide: ReservationsService, useValue: reservationsService },
      ],
    }).compile();

    controller = module.get(ReservationsController);
  });

  it('reserves a seat for the current user on the given concert', async () => {
    reservationsService.reserve.mockResolvedValue({ id: 'log-1' });

    await controller.reserve(user, { concertId: 'concert-1' });

    expect(reservationsService.reserve).toHaveBeenCalledWith(
      'user-1',
      'concert-1',
    );
  });

  it('cancels the current user reservation for the given concert', async () => {
    reservationsService.cancel.mockResolvedValue({ id: 'log-2' });

    await controller.cancel(user, 'concert-1');

    expect(reservationsService.cancel).toHaveBeenCalledWith(
      'user-1',
      'concert-1',
    );
  });

  it("returns only the current user's reservation history", async () => {
    const history = [{ id: 'log-1' }];
    reservationsService.findMyHistory.mockResolvedValue(history);

    await expect(controller.findMyHistory(user)).resolves.toBe(history);
    expect(reservationsService.findMyHistory).toHaveBeenCalledWith('user-1');
  });

  it('returns the full reservation history for the audit trail', async () => {
    const history = [{ id: 'log-1' }, { id: 'log-2' }];
    reservationsService.findAllHistory.mockResolvedValue(history);

    await expect(controller.findAllHistory()).resolves.toBe(history);
  });
});
