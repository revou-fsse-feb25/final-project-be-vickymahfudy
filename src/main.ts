import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global exception filter for consistent error responses
  app.useGlobalFilters(new HttpExceptionFilter());

  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:3002',
      'http://127.0.0.1:3002',
      'https://final-project-fe-vickymahfudy-production.up.railway.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Revou LMS API')
    .setDescription(
      'Comprehensive Learning Management System API Documentation. ' +
        'This API provides endpoints for managing educational content, user authentication, ' +
        'enrollment processes, and assignment submissions. Built with NestJS, Prisma, and PostgreSQL. ' +
        'Current API version: v1.0 - All endpoints are stable and production-ready.',
    )
    .setVersion('1.0')
    .setTermsOfService('https://revou.co/terms')
    .setExternalDoc(
      'API Changelog',
      'https://github.com/revou/lms-api/blob/main/CHANGELOG.md',
    )
    .setContact('Revou Support', 'https://revou.co', 'support@revou.co')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer('http://localhost:3001', 'Development Server')
    .addServer(
      'https://final-project-be-vickymahfudy-production.up.railway.app',
      'Production Server',
    )
    // Authentication & Authorization
    .addTag('auth', 'Authentication and user management endpoints')
    // Core Educational Structure
    .addTag(
      'verticals',
      'Educational program verticals (e.g., Software Engineering, Data Science)',
    )
    .addTag('batches', 'Student cohort batches within verticals')
    .addTag('modules', 'Course modules within batches')
    .addTag('weeks', 'Weekly content organization within modules')
    .addTag('lectures', 'Individual lecture sessions and content')
    // Learning & Assessment
    .addTag('assignments', 'Assignment creation and management')
    .addTag('submissions', 'Student assignment submissions and grading')
    .addTag('enrollments', 'Student enrollment and batch management')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token (format: Bearer <token>)',
        in: 'header',
      },
      'bearer',
    )
    .addSecurityRequirements('bearer')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Revou LMS API Docs',
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = 3001;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api`);
}
bootstrap();
