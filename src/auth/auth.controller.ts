import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register new user',
    description: 'Create a new user account with email, password, and role',
  })
  @ApiBody({
    type: SignUpDto,
    description: 'User registration data',
    examples: {
      student: {
        summary: 'Student Registration',
        description: 'Example of student registration',
        value: {
          email: 'student@revou.co',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
          role: 'STUDENT',
        },
      },
      teamLead: {
        summary: 'Team Lead Registration',
        description: 'Example of team lead registration',
        value: {
          email: 'teamlead@revou.co',
          password: 'password123',
          firstName: 'Jane',
          lastName: 'Smith',
          role: 'TEAM_LEAD',
        },
      },
      admin: {
        summary: 'Admin Registration',
        description: 'Example of admin registration',
        value: {
          email: 'admin@revou.co',
          password: 'password123',
          firstName: 'Admin',
          lastName: 'User',
          role: 'ADMIN',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'clxxxxx' },
            email: { type: 'string', example: 'user@revou.co' },
            firstName: { type: 'string', example: 'John' },
            lastName: { type: 'string', example: 'Doe' },
            role: { type: 'string', example: 'STUDENT' },
            createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
            updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
          },
        },
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'email must be an email',
            'password must be longer than or equal to 6 characters',
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiConflictResponse({
    description: 'Email already exists',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Email already exists' },
        error: { type: 'string', example: 'Conflict' },
        statusCode: { type: 'number', example: 409 },
      },
    },
  })
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticate user with email and password',
  })
  @ApiBody({
    type: LoginDto,
    description: 'User login credentials',
    examples: {
      student: {
        summary: 'Student Login',
        description: 'Example of student login',
        value: {
          email: 'student1@revou.co',
          password: 'password123',
        },
      },
      teamLead: {
        summary: 'Team Lead Login',
        description: 'Example of team lead login',
        value: {
          email: 'teamlead1@revou.co',
          password: 'password123',
        },
      },
      admin: {
        summary: 'Admin Login',
        description: 'Example of admin login',
        value: {
          email: 'admin1@revou.co',
          password: 'password123',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully logged in',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'clxxxxx' },
            email: { type: 'string', example: 'user@revou.co' },
            firstName: { type: 'string', example: 'John' },
            lastName: { type: 'string', example: 'Doe' },
            role: { type: 'string', example: 'STUDENT' },
            createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
            updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
          },
        },
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['email must be an email', 'password should not be empty'],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Invalid credentials' },
        error: { type: 'string', example: 'Unauthorized' },
        statusCode: { type: 'number', example: 401 },
      },
    },
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}