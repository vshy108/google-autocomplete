import axios from 'axios';

export const fullUrlFrom = (endpoint: string) => {
  // Remove trailing slashes
  const serverUrl = import.meta.env.VITE_SERVER_URL.replace(/\/+$/, '');
  // Remove leading slashes
  const normalizedEndpoint = endpoint.replace(/^\/+/, '');

  // Ensure there's exactly one slash between the URL parts
  return serverUrl + '/' + normalizedEndpoint;
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
