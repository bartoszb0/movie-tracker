import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(body: RegisterDto) {
    if (body.password !== body.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: body.email,
          password: hashedPassword,
        },
      });
      return {
        accesss_token: await this.generateToken(user.id, user.email),
        id: user.id,
        email: user.email,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Email already in use');
      }
      throw error;
    }
  }

  async login(body: LoginDto) {
    const match = await this.prisma.user.findFirst({
      where: { email: body.email },
    });

    if (!match) throw new UnauthorizedException('Invalid credentials');

    const compareResult = await bcrypt.compare(body.password, match.password);

    if (!compareResult) throw new UnauthorizedException('Invalid credentials');

    return {
      access_token: await this.generateToken(match.id, match.email),
      id: match.id,
      email: match.email,
    };
  }

  private async generateToken(userId: string, email: string) {
    return this.jwtService.signAsync({ sub: userId, email });
  }
}
