import axios from 'axios';

const buildClient = (context) => {
  // console.log("buildClient", {headers: context.req?.headers, is_window: (typeof window === 'undefined')});
  if (typeof window === 'undefined') {
    return axios.create({
      baseURL: 'http://localhost:8090',
      headers: context.req.headers
    });
  } else {
    return axios.create({
      baseURL: '/'
    });
  }
}

export default buildClient;
