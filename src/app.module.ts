import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as Joi from '@hapi/joi';
import storageEnv from './common/constants/storage-env.const';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MAX_FILE_SIZE: Joi.number().required(),
        UPLOADED_FILES_DESTINATION: Joi.string().required(),
        // DOWNLOADED_FILES_DESTINATION: Joi.string().required(),
        PROJECT_ID: Joi.string().required(),
        PRIVATE_KEY: Joi.string().required(),
        CLIENT_EMAIL: Joi.string().required(),
        STORAGE_MEDIA_BUCKET: Joi.string().required(),
      }),
      load: [storageEnv],
    }),
    MongooseModule.forRoot(`${process.env.DB_URL}`),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
