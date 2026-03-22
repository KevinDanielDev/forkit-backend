import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { UsersService } from 'src/users/users.service';

import { CreateUserDto } from 'src/users/dto/signup-user.dto';
import { IPayload } from './interfaces/payload.interface';
import { SigninUserDto } from 'src/users/dto/signin-user.dto';

/**
 * Service responsible for handling authentication operations.
 * Manages user registration, login, logout, and token refresh functionality.
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Registers a new user in the system.
   * Validates that the user doesn't already exist, hashes the password,
   * creates the user, and generates JWT tokens.
   *
   * @param {CreateUserDto} createUserDto - The user registration data
   * @returns {Promise<Object>} An object containing JWT tokens and user information
   * @returns {Object} return.jwtTokens - The generated access and refresh tokens
   * @returns {string} return.jwtTokens.accessToken - JWT access token (expires in 1h)
   * @returns {string} return.jwtTokens.refreshToken - JWT refresh token (expires in 7d)
   * @returns {Object} return.user - User data without sensitive fields
   * @throws {BadRequestException} When a user with the same email already exists
   * @throws {InternalServerErrorException} When an unexpected error occurs
   *
   * @example
   * const result = await authService.signUp({
   *   email: 'user@example.com',
   *   password: 'securePassword123',
   *   phone: '+1234567890'
   * });
   * // Returns: { jwtTokens: { accessToken: '...', refreshToken: '...' }, user: { email: '...', ... } }
   */
  async signUp(createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.findByTerm(createUserDto.email);

      if (user) throw new BadRequestException('User already exists');

      const saltOrRounds = 10;
      const hashedPassword = await bcrypt.hash(
        createUserDto.password,
        saltOrRounds,
      );

      const newUser = await this.usersService.create({
        ...createUserDto,
        password: hashedPassword,
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, id, refreshToken, ...restUser } = newUser;

      const payload: IPayload = {
        id: newUser.id,
        email: newUser.email,
      };

      const jwtTokens = await this.generateJwtTokens(payload);

      const hashedRefreshToken = await bcrypt.hash(
        jwtTokens.refreshToken,
        saltOrRounds,
      );

      await this.usersService.updateRefreshToken(
        payload.id,
        hashedRefreshToken,
      );

      return {
        jwtTokens: {
          accessToken: jwtTokens.accessToken,
          refreshToken: jwtTokens.refreshToken,
        },
        user: restUser,
      };
    } catch (error) {
      this.logger.error(error);

      if (error instanceof BadRequestException) throw error;

      throw new InternalServerErrorException(
        'Internal server error, please review logs',
      );
    }
  }

  /**
   * Authenticates a user with their credentials.
   * Validates the email and password, then generates new JWT tokens.
   *
   * @param {SigninUserDto} signinUserDto - The user login credentials
   * @returns {Promise<Object>} An object containing JWT tokens and user information
   * @returns {Object} return.jwtTokens - The generated access and refresh tokens
   * @returns {string} return.jwtTokens.accessToken - JWT access token (expires in 1h)
   * @returns {string} return.jwtTokens.refreshToken - JWT refresh token (expires in 7d)
   * @returns {Object} return.user - User data without sensitive fields
   * @throws {UnauthorizedException} When credentials are invalid
   * @throws {InternalServerErrorException} When an unexpected error occurs
   *
   * @example
   * const result = await authService.signIn({
   *   email: 'user@example.com',
   *   password: 'securePassword123'
   * });
   * // Returns: { jwtTokens: { accessToken: '...', refreshToken: '...' }, user: { email: '...', ... } }
   */
  public async signIn(signinUserDto: SigninUserDto) {
    try {
      const { email, password } = signinUserDto;

      const user = await this.usersService.findByTerm(email);

      if (!user) throw new UnauthorizedException('Invalid credentials');

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid)
        throw new UnauthorizedException('Invalid credentials');

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, password: _, refreshToken: __, ...restUser } = user;

      const payload: IPayload = {
        id: user.id,
        email: user.email,
      };

      const jwtTokens = await this.generateJwtTokens(payload);

      return {
        jwtTokens: {
          accessToken: jwtTokens.accessToken,
          refreshToken: jwtTokens.refreshToken,
        },
        user: restUser,
      };
    } catch (error) {
      this.logger.error(error);

      if (error instanceof UnauthorizedException) throw error;

      throw new InternalServerErrorException(
        'Internal server error, please review logs',
      );
    }
  }

  /**
   * Logs out a user by invalidating their refresh token.
   * Sets the user's refresh token to null in the database.
   *
   * @param {string} term - The user identifier (UUID, email, or phone)
   * @returns {Promise<Object>} A success message
   * @returns {string} return.message - Logout confirmation message
   * @throws {UnauthorizedException} When the user is not found
   * @throws {InternalServerErrorException} When an unexpected error occurs
   *
   * @example
   * const result = await authService.logOut('user@example.com');
   * // Returns: { message: 'User logged out successfully' }
   */
  public async logOut(term: string) {
    try {
      const user = await this.usersService.findByTerm(term);
      if (!user) throw new UnauthorizedException();

      await this.usersService.updateRefreshToken(term, null);

      return { message: 'User logged out successfully' };
    } catch (error) {
      this.logger.error(error);

      if (error instanceof UnauthorizedException) throw error;

      throw new InternalServerErrorException(
        'Internal server error, please review logs',
      );
    }
  }

  /**
   * Refreshes an expired access token using a valid refresh token.
   * Verifies the refresh token, validates it against the stored hash,
   * and generates a new access token.
   *
   * @param {string} refreshToken - The JWT refresh token
   * @returns {Promise<Object>} An object containing the new access token
   * @returns {string} return.accessToken - New JWT access token (expires in 1h)
   * @throws {UnauthorizedException} When the refresh token is invalid or user not found
   * @throws {InternalServerErrorException} When an unexpected error occurs
   *
   * @example
   * const result = await authService.refreshAccessToken('valid.refresh.token');
   * // Returns: { accessToken: 'new.access.token' }
   */
  public async refreshAccessToken(refreshToken: string) {
    try {
      const payload: IPayload = await this.jwtService.verifyAsync(refreshToken);
      const user = await this.usersService.findByTerm(payload.id);

      if (!user || !user.refreshToken) throw new UnauthorizedException();

      const isRefreshTokenValid = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );

      if (!isRefreshTokenValid) throw new UnauthorizedException();

      const newAccessToken = await this.jwtService.signAsync(payload, {
        expiresIn: '1h',
      });

      return { accessToken: newAccessToken };
    } catch (error) {
      this.logger.error(error);

      if (error instanceof UnauthorizedException) throw error;

      throw new InternalServerErrorException(
        'Internal server error, please review logs',
      );
    }
  }

  /**
   * Generates both access and refresh JWT tokens for a user.
   * Also updates the user's stored refresh token hash in the database.
   * This is a private helper method used internally by the service.
   *
   * @private
   * @param {IPayload} payload - The JWT payload containing user identification data
   * @returns {Promise<Object>} An object containing both tokens
   * @returns {string} return.accessToken - JWT access token (expires in 1h)
   * @returns {string} return.refreshToken - JWT refresh token (expires in 7d)
   *
   * @example
   * const tokens = await this.generateJwtTokens({ id: 'user-id', email: 'user@example.com' });
   * // Returns: { accessToken: '...', refreshToken: '...' }
   */
  private async generateJwtTokens(payload: IPayload) {
    const saltOrRounds = 10;

    const hashRefreshToken = await bcrypt.hash(payload.id, saltOrRounds);

    await this.usersService.updateRefreshToken(payload.id, hashRefreshToken);

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: '1h',
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
      }),
    };
  }
}
