import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { Booking } from '../generated/prisma/client.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<Booking[]> {
    return this.prisma.booking.findMany({ orderBy: { createdAt: 'desc' } });
  }

  // C1: check and update in one SQL statement, inside one transaction
  async create(eventId: number, dto: CreateBookingDto): Promise<Booking> {
    return this.prisma.$transaction(async (tx) => {
      const event = await tx.event.findUnique({ where: { id: eventId } });
      if (!event) throw new NotFoundException('Event not found');

      const res = await tx.event.updateMany({
        where: { id: eventId, booked: { lte: event.capacity - dto.seats } },
        data: { booked: { increment: dto.seats } },
      });
      if (res.count === 0) {
        const left = event.capacity - event.booked;
        throw new ConflictException(`Only ${left} seat(s) left`);
      }

      return tx.booking.create({
        data: { eventId, name: dto.name, email: dto.email, seats: dto.seats },
      });
    });
  }

  // C2: delete the booking and give its seats back, in one transaction
  async remove(id: number): Promise<void> {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found');

    await this.prisma.$transaction([
      this.prisma.booking.delete({ where: { id } }),
      this.prisma.event.update({
        where: { id: booking.eventId },
        data: { booked: { decrement: booking.seats } },
      }),
    ]);
  }
}