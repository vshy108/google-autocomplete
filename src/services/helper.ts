import axios from 'axios';

export const fullUrlFrom = (endpoint: string) => {
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  // TODO: remove all trailing / of serverUrl and leading / of endpoint

  return serverUrl + endpoint;
};

const request = (
  method: string,
  endpoint: string,
  params = {},
  headers = {}
) => {
  if (method === 'get') {
    return axios({
      method,
      params,
      headers,
      url: fullUrlFrom(endpoint),
    });
  }

  return axios({
    method,
    data: params,
    url: fullUrlFrom(endpoint),
  });
};

const api = {
  get(endpoint: string, params?: object, headers?: object) {
    return request('get', endpoint, params, headers);
  },
  post(endpoint: string, params?: object) {
    return request('post', endpoint, params);
  },
  put(endpoint: string, params: object) {
    return request('put', endpoint, params);
  },
  patch(endpoint: string, params: object) {
    return request('patch', endpoint, params);
  },
  delete(endpoint: string, params?: object) {
    return request('delete', endpoint, params);
  },
};

export default api;
