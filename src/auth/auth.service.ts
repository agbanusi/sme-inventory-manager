import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User } from './entities/user.entity';
import { RegisterDTO } from './dtos/register.dto';
import { UserRepository } from './repositories/user.repository';
// import { InjectRedis, Redis } from '@nestjs/redis';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    // private mailerService: MailerService,
    // @InjectRedis() private readonly redis: Redis,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.isVerified) {
      throw new UnauthorizedException(
        'Account not verified. Please verify your account.',
      );
    }
    const payload = {
      ...user,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDTO) {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.userRepository.save({
      ...registerDto,
      password: hashedPassword,
      isEmployee: false,
      permissions: ['read', 'write'],
    });

    // await this.sendVerificationOtp(user.email);

    return {
      message: 'User registered. Please check your email for verification OTP.',
    };
  }

  async sendVerificationOtp(email: string) {
    const otp = crypto.randomInt(100000, 999999).toString();
    await this.redis.set(`verificationOtp:${email}`, otp, 'EX', 600); // 10 minutes expiry

    await this.mailerService.sendMail({
      to: email,
      subject: 'Verify Your Account',
      text: `Your verification OTP is: ${otp}. It will expire in 10 minutes.`,
    });
  }

  async verifyAccount(email: string, otp: string) {
    const storedOtp = await this.redis.get(`verificationOtp:${email}`);
    if (!storedOtp || otp !== storedOtp) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    user.isVerified = true;
    await this.userRepository.save(user);
    await this.redis.del(`verificationOtp:${email}`);

    return { message: 'Account verified successfully' };
  }

  async resendVerificationOtp(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (user.isVerified) {
      throw new ConflictException('Account is already verified');
    }

    await this.sendVerificationOtp(email);
    return { message: 'Verification OTP resent. Please check your email.' };
  }

  async generateLoginOtp(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (!user.isVerified) {
      throw new UnauthorizedException(
        'Account not verified. Please verify your account first.',
      );
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    await this.redis.set(`loginOtp:${email}`, otp, 'EX', 300); // 5 minutes expiry

    await this.mailerService.sendMail({
      to: email,
      subject: 'Your Login OTP',
      text: `Your login OTP is: ${otp}. It will expire in 5 minutes.`,
    });

    return { message: 'Login OTP sent to your email' };
  }

  async verifyLoginOtp(email: string, otp: string) {
    const storedOtp = await this.redis.get(`loginOtp:${email}`);
    if (!storedOtp || otp !== storedOtp) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    await this.redis.del(`loginOtp:${email}`);

    const payload = {
      ...user,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getAuthData(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const { password, ...result } = user;
    return result;
  }
}
