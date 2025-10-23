import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import { Logger } from '@nestjs/common';
import * as hbs from 'express-handlebars';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose']
  });

  app.useLogger(['log', 'error', 'warn', 'debug', 'verbose']);

  const logger = new Logger('Bootstrap');
  Logger.overrideLogger(['log', 'error', 'warn', 'debug', 'verbose']);
  console.log('Console.log works'); // Always visible
  new Logger('Test').log('Log works?');
  new Logger('Test').debug('Debug works?');

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // strips unknown properties
    forbidNonWhitelisted: true, // throws error if unknown properties are sent
    transform: true, // automatically transform payloads to DTO instances
  }));

  app.engine(
    'hbs',
    hbs.engine({
      extname: 'hbs',
      defaultLayout: 'main',
      layoutsDir: join(__dirname, '..', 'views'),
    }),
  );

  app.useStaticAssets(join(__dirname, '..', 'public'));
  // Configure templates directory and view engine
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  app.use(cookieParser());
  logger.log("HOLA HOLA");

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
