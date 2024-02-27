import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// global makes it available to all modules
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
