import { DownloadResponse, Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { StorageFile } from './dto/storage-file';
import storageEnv from '../common/constants/storage-env.const';

@Injectable()
export class StorageService {
  private storage: Storage;
  private bucket: string;

  constructor() {
    this.storage = new Storage({
      projectId: storageEnv().projectId,
      credentials: {
        client_email: storageEnv().client_email,
        private_key: storageEnv().private_key,
      },
    });

    this.bucket = storageEnv().mediaBucket;
  }

  async upload({
    fileKey,
    media,
    metadata,
    contentType,
  }: {
    fileKey: string;
    media: Buffer;
    metadata?: { [key: string]: string }[];
    contentType?: string;
  }) {
    const object = metadata.reduce((obj, item) => Object.assign(obj, item), {});
    const file = this.storage.bucket(this.bucket).file(fileKey);
    const stream = file.createWriteStream();
    stream.on('finish', async () => {
      return await file.setMetadata({
        metadata: object,
        contentType,
      });
    });
    stream.end(media);
  }

  async delete(fileKey: string) {
    await this.storage
      .bucket(this.bucket)
      .file(fileKey)
      .delete({ ignoreNotFound: true });
  }

  async getFile(
    fileKey: string,
    localDownloadPath?: string,
  ): Promise<StorageFile> {
    let options;

    if (localDownloadPath) {
      options = {
        destination: localDownloadPath + '/' + fileKey,
      };
    }

    const fileResponse: DownloadResponse = await this.storage
      .bucket(this.bucket)
      .file(fileKey)
      .download(options);

    const [buffer] = fileResponse;
    const storageFile = new StorageFile();
    storageFile.buffer = buffer;
    storageFile.metadata = new Map<string, string>();
    return storageFile;
  }

  async getFileWithMetaData(fileKey: string): Promise<StorageFile> {
    const [metadata] = await this.storage
      .bucket(this.bucket)
      .file(fileKey)
      .getMetadata();

    const fileResponse: DownloadResponse = await this.storage
      .bucket(this.bucket)
      .file(fileKey)
      .download();

    const [buffer] = fileResponse;

    const storageFile = new StorageFile();
    storageFile.buffer = buffer;
    storageFile.metadata = new Map<string, string>(
      Object.entries(metadata || {}),
    );
    storageFile.contentType = storageFile.metadata.get('contentType');

    return storageFile;
  }
}
