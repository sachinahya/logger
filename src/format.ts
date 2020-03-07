import { format as formatDate } from 'date-fns';
import { format } from 'winston';

export const enumerateErrorFormat = format(info => {
  if ((info.message as any) instanceof Error) {
    info.message = Object.assign(
      {
        message: (info.message as any).message,
        stack: (info.message as any).stack,
      },
      info.message
    );
  }

  if (info instanceof Error) {
    return Object.assign(
      {
        message: info.message,
        stack: info.stack,
      },
      info
    );
  }

  return info;
});

export const fileFormatter = format.combine(format.timestamp(), format.json());

export const consoleFormatter = format.combine(
  format(info => {
    if (info.stack) {
      info.message = info.stack;
      delete info.stack;
    }
    return info;
  })(),
  format.colorize(),
  format.align(),
  format.simple()
);

export const getTimestampedFileName = (str: string): string => {
  const name = str.slice(0, str.lastIndexOf('.'));
  const ext = str.slice(str.lastIndexOf('.'));

  const dt = formatDate(new Date(), 'yyyy-MM-dd');

  return `${name}_${dt}${ext}`;
};
