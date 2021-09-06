import { AxiosRequestConfig } from 'axios';
import uri, { authServerBase } from '@/api/uri';
import Client from '@/api/client';
import { CrudResponse, Profile, ProfileUpdate, SetAccountPasswordPayload } from '@/types';
import { BaseRequest, Request } from '@/api/requests/base';

interface LoginResponse {
  session: string;
}

export class LoginRequest extends Request<LoginResponse> {
  username: string;
  password: string;

  constructor(username: string, password: string) {
    super();
    this.username = username;
    this.password = password;
  }

  makeRequest(): AxiosRequestConfig {
    return {
      method: 'post',
      url: authServerBase + uri.login,
      data: {
        username: this.username,
        password: this.password
      }
    };
  }
}

export class LogoutRequest extends Request<unknown> {
  makeRequest(): AxiosRequestConfig {
    return {
      method: 'post',
      url: authServerBase + uri.logout
    };
  }
}

export class ActivateAccount extends Request<unknown> {
  payload: SetAccountPasswordPayload;
  constructor(payload: SetAccountPasswordPayload) {
    super();
    this.payload = payload;
  }
  makeRequest(): AxiosRequestConfig {
    return {
      method: 'post',
      url: authServerBase + uri.activate,
      data: this.payload
    };
  }
}

export class ForgotPassword extends Request<unknown> {
  payload: { username: string };
  constructor(payload: { username: string }) {
    super();
    this.payload = payload;
  }
  makeRequest(): AxiosRequestConfig {
    return {
      method: 'post',
      url: authServerBase + uri.forgotpassword,
      data: this.payload
    };
  }
}

export class ResetPassword extends Request<unknown> {
  payload: SetAccountPasswordPayload;
  constructor(payload: SetAccountPasswordPayload) {
    super();
    this.payload = payload;
  }
  makeRequest(): AxiosRequestConfig {
    return {
      method: 'post',
      url: authServerBase + uri.resetpassword,
      data: this.payload
    };
  }
}

export class CheckToken extends BaseRequest<unknown> {
  token: string;

  constructor(token: string) {
    super();
    this.token = token;
  }
  generateConfig(client: Client): AxiosRequestConfig {
    return {
      baseURL: client.baseURL,
      headers: { Authorization: this.token },
      ...this.makeRequest()
    };
  }

  makeRequest(): AxiosRequestConfig {
    return {
      url: authServerBase + uri.validateAuth
    };
  }
}

export class GetProfile extends Request<Profile> {
  makeRequest(): AxiosRequestConfig {
    return {
      url: authServerBase + uri.profile
    };
  }
}

export class UpdateProfile extends Request<CrudResponse> {
  payload: ProfileUpdate;
  constructor(payload: ProfileUpdate) {
    super();
    this.payload = payload;
  }

  makeRequest(): AxiosRequestConfig {
    return {
      method: 'put',
      url: authServerBase + uri.profile,
      data: this.payload
    };
  }
}
