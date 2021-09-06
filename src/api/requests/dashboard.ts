import { AxiosRequestConfig } from 'axios';
import uri from '@/api/uri';
import { Request } from '@/api/requests/base';
import { FeedbackFormType, FeedbackRequestPayload } from '@/types';

export class SendFeedbackForm extends Request<unknown> {
  message: string;
  type: FeedbackFormType;

  constructor(payload: FeedbackRequestPayload) {
    super();

    this.message = payload.message;
    this.type = payload.type;
  }

  makeRequest(): AxiosRequestConfig {
    return {
      method: 'post',
      url: `${uri.feedback_form}/`,
      data: {
        message: this.message,
        type: this.type
      }
    };
  }
}
