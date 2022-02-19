import { Logger } from '@nestjs/common';

const logger = (className: string, error, params: any) => {
  const log = new Logger(className);
  const { code } = error;
  log.error(`Something wrong with error code: ${code} and with params: `);
  log.error(params);
  log.error(error);
};

export default logger;
