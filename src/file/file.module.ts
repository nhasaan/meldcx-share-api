import { FilesController } from './files.controller';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from '../entities/file.entity';
import { FileService } from './services/file.service';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
    StorageModule,
  ],
  providers: [FileService],
  controllers: [FilesController],
})
export class FileModule {}
