import {
  Body,
  Controller,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private AuthService: AuthService) {}

  // Endpoints

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    console.log(dto);
    return this.AuthService.signup();
  }

  @Post('signin')
  signin() {
    return this.AuthService.login();
  }
}
