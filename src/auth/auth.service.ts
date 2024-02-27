import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    // generate a hash of the password
    const hash = await argon.hash(dto.password);
    // save new user to the database
    try {
      const User = await this.prisma.user.create({
        data: {
          email: dto.email,
          firstName: dto.firstName,
          lastName: dto.lastName,
          hash,
        },
        // select: {
        //   id: true,
        //   email: true,
        //   createdAt: true,
        // },
      });

      // dirty solution to remove the hash from the response
      delete User.hash;

      // return the user
      return User;
    } catch (error) {
      if (
        error instanceof
        PrismaClientKnownRequestError
      ) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'Email is already in the database',
          );
        }
        throw error;
      }
    }
  }

  async signin(dto: AuthDto) {
    // find user by email
    // if no user is found, throw an error
    const user =
      await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

    if (!user) {
      throw new ForbiddenException(
        'Invalid email!',
      );
    }
    // compare the password
    const isPasswordValid = await argon.verify(
      user.hash,
      dto.password,
    );
    // if the password is incorrect, throw an error
    if (!isPasswordValid) {
      throw new ForbiddenException(
        'Invalid password!',
      );
    }

    delete user.hash;
    // return the user without hash
    return user;
  }
}
