import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entities/user.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    if (user) {
      const passwordValid = await bcrypt.compare(password, user.password);
      if (!passwordValid) {
        throw new UnauthorizedException('Senha ou usuário incorreto');
      }
      return user;
    } else {
      throw new UnauthorizedException('Senha ou usuário incorreto');
    }
  }

  async login(user: User) {
    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(data: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      throw new BadRequestException('E-mail já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    let addressData;
    if (data.address) {
      addressData = await this.prisma.address.create({
        data: {
          street: data.address.street || '',
          number: data.address.number || '',
          district: data.address.district || '',
          city: data.address.city || '',
          state: data.address.state || '',
          zipCode: data.address.zipCode || '',
        },
      });
    } else {
      addressData = await this.prisma.address.create({
        data: {
          street: '',
          number: '',
          district: '',
          city: '',
          state: '',
          zipCode: '',
        },
      });
    }

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: hashedPassword,
        addressId: addressData.id,
      },
      include: {
        address: true,
      },
    });

    return user;
  }
}
