import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from '../users/dtos/users.dto';
import { Users } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
    private jwtService: JwtService,
  ) {}
  getAuth() {
    return 'Get all Auth';
  }

  async addUserService(
    user: CreateUserDto,
  ): Promise<Omit<Users, 'password' | 'isAdmin'>> {
    const { password, confirmPassword, email, ...userData } = user;
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException(`El email ${email} ya está en uso`);
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userRepository.save({
      ...userData,
      email,
      password: hashPassword,
      isAdmin: false,
    });

    const { password: _, isAdmin: __, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async singin(credentials: LoginUserDto) {
    const { email, password } = credentials;
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (!existingUser) {
      throw new BadRequestException('Error en las credenciales');
    }

    const passwordEqual = await bcrypt.compare(password, existingUser.password);
    if (!passwordEqual) {
      throw new BadRequestException('Error en las credenciales');
    }

    const userPayload = {
      id: existingUser.id,
      email: existingUser.email,
      isAdmin: existingUser.isAdmin,
    };

    const token = this.jwtService.sign(userPayload);

    return {
      token,
      message: 'Ingreso exitoso',
    };
  }
}
