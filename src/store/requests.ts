import { AxiosError } from 'axios';
import { failMessage } from '@/snackbar';

export function handleFailedRequest(
  err: AxiosError,
  ignoreStatus: number[] | null = null
): Promise<void> {
  {
    ignoreStatus = ignoreStatus || [];
    const errors: Record<number, string> = {
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      409: 'Conflict',
      500: 'Internal Server Error',
      502: 'Bad Gateway'
    };
    let status = -1;
    let message = '';

    if (err.response) {
      status = err.response.status;
      message = JSON.stringify(err.response.data.message);
    }
    if (ignoreStatus.includes(status)) {
      return Promise.resolve();
    }
    if (!message) {
      message = errors[status] || 'Unknown Error';
    }

    failMessage(`Error ${status}: ${message}`);
    return Promise.reject(err);
  }
}

export function downloadAsFile(data: Blob, filename: string) {
  const url = window.URL.createObjectURL(data);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
}
