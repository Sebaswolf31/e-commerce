import {
  Controller,
  Get,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
  Put,
  Body,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from 'src/decorators/roles.decorators';
import { Role } from 'src/roles.enum';
import { RolesGuard } from '../auth/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

import { UpdateUserDto } from './dtos/update-users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @Get()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  getUsers(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.usersService.getUsersService(
      Number(page) || 1,
      Number(limit) || 5,
    );
  }

  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(AuthGuard)
  getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getUserByIdService(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @Roles(Role.Editor)
  async updateUser(
    @Param('id', ParseUUIDPipe) userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUserService(userId, updateUserDto);
  }
}
