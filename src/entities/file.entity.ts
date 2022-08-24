import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.entity';

@Schema({
  timestamps: true,
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class File {
  @Prop({ required: true })
  fileKey: string;

  @Prop({ required: true })
  fileName: string;

  @Prop()
  fileUrl: string;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
  })
  owner: Types.ObjectId;

  _id?: Types.ObjectId;
  id?: Types.ObjectId;
  createdAt?: Date;
}

export type FileDocument = File & Document;
export const FileSchema = SchemaFactory.createForClass(File);
