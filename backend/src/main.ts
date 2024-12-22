import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.enableCors({
    origin:`${process.env.BASE_URL}:${process.env.BASE_PORT}`, //frontend URL
    methods:'GET,POST,PUT,PATCH,DELETE',
    credentials:true,
  });
  await app.listen(process.env.BASE_PORT);

  console.log(`Server is running on ${process.env.BASE_URL}:${process.env.BASE_PORT}`);
  
}
bootstrap();