import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import type { Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';

class LoginDto {
  email: string = '';
  password: string = '';
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.validateUser(body.email, body.password);
    const { access_token } = await this.authService.login(user);

    response.cookie('uaifoodtoken', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite:'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });

    return {
      message: 'Login realizado com sucesso',
      access_token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: CreateUserDto) {
    const user = await this.authService.register(body);
    return this.authService.login(user);
  }
}
