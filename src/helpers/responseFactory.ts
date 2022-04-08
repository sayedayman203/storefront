export interface JsendResponse {
  status: 'success' | 'fail' | 'error';
  data?: { [key: string]: unknown };
  message?: string;
}

export const createResponse = (
  status: 'success' | 'fail' | 'error',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any = {},
  message?: string
): JsendResponse => {
  const res: JsendResponse = {
    status,
  };

  switch (status) {
    case 'error': {
      if (data) {
        res.data = data;
      }

      res.message = message;
      break;
    }
    case 'success':
    case 'fail': {
      if (data) {
        res.data = data;
      }
      if (message) {
        res.message = message;
      }
      break;
    }
  }
  return res;
};
