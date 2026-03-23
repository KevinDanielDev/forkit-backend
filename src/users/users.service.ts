import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { Repository } from 'typeorm';

import { isEmail, isUUID } from 'class-validator';

import { User } from './entities/user.entity';
import { SignUpUserDto } from './dto/signup-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IPayload } from 'src/auth/interfaces/payload.interface';
import { hashPassword } from 'src/common/utils/hash.util';

/**
 * Service responsible for managing user-related operations.
 * Provides methods for creating, finding, and updating user records.
 */
@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Finds a user by a search term that can be a UUID, email, or phone number.
   * Automatically detects the type of search term and queries accordingly.
   *
   * @param {string} term - The search term (UUID, email, or phone number)
   * @returns {Promise<User | null>} The found user or null if not found
   * @throws {InternalServerErrorException} When an unexpected error occurs
   *
   * @example
   * // Find by UUID
   * const user = await usersService.findByTerm('123e4567-e89b-12d3-a456-426614174000');
   *
   * @example
   * // Find by email
   * const user = await usersService.findByTerm('user@example.com');
   *
   * @example
   * // Find by phone
   * const user = await usersService.findByTerm('+1234567890');
   */
  public async findByTerm(term: string) {
    try {
      let user: User | null;

      switch (true) {
        case isUUID(term):
          user = await this.userRepository.findOneBy({ id: term });
          break;
        case isEmail(term):
          user = await this.userRepository.findOneBy({ email: term });
          break;
        default:
          user = await this.userRepository.findOneBy({ phone: term });
          break;
      }

      return user;
    } catch (error) {
      this.logger.error(error);

      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        'Internal server error, please review logs',
      );
    }
  }

  /**
   * Creates a new user in the database.
   *
   * @param {CreateUserDto} createUserDto - The data transfer object containing user information
   * @returns {Promise<User>} The newly created user entity
   * @throws {InternalServerErrorException} When an error occurs during user creation
   *
   * @example
   * const newUser = await usersService.create({
   *   email: 'user@example.com',
   *   password: 'hashedPassword',
   *   phone: '+1234567890'
   * });
   */
  public async create(signUpUserDto: SignUpUserDto) {
    try {
      const user = this.userRepository.create(signUpUserDto);

      return await this.userRepository.save(user);
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException(
        'Internal server error, please review logs',
      );
    }
  }

  /**
   * Updates the refresh token for a user identified by the given term.
   *
   * @param {string} term - The user identifier (UUID, email, or phone)
   * @param {string | null} refreshToken - The new refresh token to store, or null to remove it
   * @returns {Promise<UpdateResult>} The result of the update operation
   *
   * @example
   * // Set a new refresh token
   * await usersService.updateRefreshToken('user-id', 'hashedRefreshToken');
   *
   * @example
   * // Remove refresh token (logout)
   * await usersService.updateRefreshToken('user-id', null);
   */
  public async updateRefreshToken(term: string, refreshToken: string | null) {
    return this.userRepository.update(term, { refreshToken: refreshToken });
  }

  /**
   * Updates the user profile information.
   *
   * @param {string} token - The JWT token containing the user ID
   * @param {UpdateUserDto} updateUserDto - The data transfer object containing the user information to update
   * @returns {Promise<{ message: string }>} The result of the update operation
   * @throws {InternalServerErrorException} When an error occurs during user update
   * @throws {NotFoundException} When the user is not found
   *
   * @example
   * // Update user profile
   * const result = await usersService.update({
   *   firstName: 'John',
   *   lastName: 'Doe',
   *   password: 'newPassword'
   * });
   */
  public async update(token: string, updateUserDto: UpdateUserDto) {
    const message: string = 'User updated successfully';

    const { id }: IPayload = await this.jwtService.verify(token);
    try {
      const user = await this.findByTerm(id);

      if (!user) throw new NotFoundException('User not found');

      const userValues = Object.values(updateUserDto);
      const isEmpty = userValues.every(
        (value) => value === null || value === undefined || value === '',
      );

      if (isEmpty) {
        return {
          message: message,
          user: user,
        };
      }

      const { firstName, lastName, password } = updateUserDto;

      if (firstName && firstName !== user.firstName) user.firstName = firstName;
      if (lastName && lastName !== user.lastName) user.lastName = lastName;

      if (password && password !== user.password) {
        const hashedPassword = await hashPassword(password, 10);
        user.password = hashedPassword;
      }

      // TODO: Change to update
      await this.userRepository.save(user);

      this.logger.log(`User ${user.id} updated successfully`);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _password, id: _id, ...restUser } = user;

      return {
        message: message,
        user: restUser,
      };
    } catch (error) {
      this.logger.error(error);

      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        'Internal server error, please review logs',
      );
    }
  }
}
