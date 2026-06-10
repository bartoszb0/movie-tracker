import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  register(body: RegisterDto) {
    return 'this will register user';
  }

  login(body: LoginDto) {
    return `this will login user`;
  }
}
