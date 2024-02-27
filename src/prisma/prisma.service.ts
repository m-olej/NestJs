import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    // calls the constructor of the parent class
    super({
      datasources: {
        db: {
          url: `file:${process.env.DATABASE_URL}`,
        },
      },
    });
  }
}
