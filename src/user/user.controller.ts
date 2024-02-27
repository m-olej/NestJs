import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { jwtGuard } from 'src/auth/guard';
import { getUser } from 'src/auth/decorator';
import { User } from 'prisma/prisma-client';

@Controller('users')
export class UserController {
  // can have different scopes depending on where it is in code
  @UseGuards(jwtGuard)
  @Get('me')
  getMe(@getUser() user: User, @getUser('email') email: string) {
    return user;
  }
}
