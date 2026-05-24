import { EQueueCmd } from './constants';

export interface IQueuePattern {
  cmd: EQueueCmd;
}

export interface IQueueResponse {
  success: boolean;
}

export interface IEmailCode {
  email: string;
  code: string;
}
