import { VueConstructor } from 'vue/types/umd';

export interface WidgetOpts<L = unknown, A = unknown, P = Record<string, unknown>> {
  imgUrl?: string;
  imgAlt?: string;
  icon?: string;
  iconPack?: string;
  videoUrl?: string;
  title?: string;
  subtitle?: string;
  content?: string;
  component?: VueConstructor | null;
  componentProps?: P;
  action?: (event: A) => void;
  listeners?: Record<string, (payload: L) => void>;
  url?: string;
  buttonText?: string;
  buttonIcon?: string;
  buttonIconPack?: string;
  style?: Record<string, string>;
}

export enum FeedbackFormType {
  BUG_REPORT = 'bug_report',
  FEATURE_REQUEST = 'feature_request',
  OTHER = 'other'
}

export interface FeedbackRequestPayload {
  message: string;
  type: FeedbackFormType;
}
