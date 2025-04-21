import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from '../users/dtos/users.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('singup')
  singup(@Body() user: CreateUserDto) {
    return this.authService.addUserService(user);
  }

  @Post('/signin')
  signin(@Body() credentials: LoginUserDto) {
    return this.authService.singin(credentials);
  }
}
