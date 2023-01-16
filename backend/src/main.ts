import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import logger from 'morgan';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        cors: true,
    });
    app.use(logger('dev'));
    app.useGlobalPipes(new ValidationPipe());
    const config = new DocumentBuilder()
        .addBearerAuth({ in: 'Authorization', type: 'http' })
        .setTitle('Meet Server')
        .setDescription('The Meet Server API description')
        .setVersion('1.0')
        .addTag('auth')
        .addTag('user')
        .addTag('room')
        .build();
    const document = SwaggerModule.createDocument(app, config, {
        deepScanRoutes: true,
    });
    SwaggerModule.setup('docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });
    await app.listen(process.env.PORT);
}
bootstrap();
