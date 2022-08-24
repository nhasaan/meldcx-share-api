import { extname } from 'path';

export const fileFilter = (req, file, callback) => {
  const allowedFileTypes = process.env.FILE_TYPES.split(',');
  const isAllowed = allowedFileTypes.some((t) =>
    file.originalname.match('.' + t),
  );

  if (!isAllowed) {
    return callback(
      new Error('Only specified type of files are allowed!'),
      false,
    );
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  const ext = extname(file.originalname);
  const fileName = file.originalname
    .replace(ext, '')
    .replace(/[^A-Z0-9]+/gi, '-');
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${fileName}-${randomName}${ext}`);
};
