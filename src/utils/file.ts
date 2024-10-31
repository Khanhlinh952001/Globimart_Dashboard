import path from 'node:path';

export const getFileTypeFromUrl = (url: string): string | null => {
  const fileExtension = path.extname(url);
  const fileType = fileExtension.slice(1); // Remove the leading dot (.)
  return fileType;
};
