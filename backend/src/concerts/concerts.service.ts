import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConcertDto } from './dto/create-concert.dto';

@Injectable()
export class ConcertsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.concert.findMany({ orderBy: { name: 'asc' } });
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
