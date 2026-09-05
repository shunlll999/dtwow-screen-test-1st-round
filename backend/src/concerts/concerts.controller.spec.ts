import { Test, TestingModule } from '@nestjs/testing';
import { ConcertsController } from './concerts.controller';
import { ConcertsService } from './concerts.service';

describe('ConcertsController', () => {
  let controller: ConcertsController;
  let concertsService: {
    findAll: jest.Mock;
    stats: jest.Mock;
    create: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    concertsService = {
      findAll: jest.fn(),
      stats: jest.fn(),
      create: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConcertsController],
      providers: [{ provide: ConcertsService, useValue: concertsService }],
    }).compile();

    controller = module.get(ConcertsController);
  });

  it('delegates findAll to ConcertsService', async () => {
    const concerts = [{ id: '1', name: 'Rock Night' }];
    concertsService.findAll.mockResolvedValue(concerts);

    await expect(controller.findAll()).resolves.toBe(concerts);
    expect(concertsService.findAll).toHaveBeenCalled();
  });

  it('delegates stats to ConcertsService', async () => {
    const summary = { totalSeats: 500, reserved: 120, cancelled: 12 };
    concertsService.stats.mockResolvedValue(summary);

    await expect(controller.stats()).resolves.toBe(summary);
    expect(concertsService.stats).toHaveBeenCalled();
  });

  it('delegates create to ConcertsService with the dto', async () => {
    const dto = { name: 'Rock Night', description: 'Loud', totalSeats: 100 };
    const created = { id: '1', ...dto, reservedSeats: 0 };
    concertsService.create.mockResolvedValue(created);

    await expect(controller.create(dto)).resolves.toBe(created);
    expect(concertsService.create).toHaveBeenCalledWith(dto);
  });

  it('delegates remove to ConcertsService with the id', async () => {
    concertsService.remove.mockResolvedValue(undefined);

    await controller.remove('concert-1');

    expect(concertsService.remove).toHaveBeenCalledWith('concert-1');
  });
});
