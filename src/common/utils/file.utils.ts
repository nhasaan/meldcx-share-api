import { extname } from 'path';

export const shFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(sh)$/)) {
    return callback(new Error('Only sh files are allowed!'), false);
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
