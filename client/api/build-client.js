import axios from 'axios';

const buildAxios = ({ req }) => {
  // a check to see whether we are on the server or browser. This will determine the url we use when making requests
  if (typeof window === 'undefined') {
    // we are on the server

    // the first part of this domain is how we make cross namespace requests within our k8s cluster. Since this request is made during server side
    // rendering it's made from within the client pod in our cluster. We need a way to reach our from this pod to the auth pod. There are
    // several different approaches. We chose to make a request to the ingress-controller and let the ingress route the request to the
    // auth service

    // we specify the service and then the namespace
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    });
  } else {
    // we are one the browser
    return axios.create({
      baseURL: '/',
    });
  }
};

export default buildAxios;
