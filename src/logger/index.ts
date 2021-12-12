
import { configure, getLogger, Logger } from 'log4js';
import { Token, Container } from 'typedi';

const config = {
  appenders: {
    console: {
      type: 'console'
    }
  },
  categories: {
    default: {
      appenders: ['console'],
      level: 'all'
    },
    db: {
      appenders: ['console'],
      level: 'info'
    }
  }
};

configure(config);

export const LOGGER = new Token<Logger>('LOGGER');
Container.set(LOGGER, getLogger());
