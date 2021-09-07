import React from 'react';
import axios from 'axios';

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);
  axios.get('/api/users/currentuser');
  return <h1>Landing page</h1>;
};

LandingPage.getInitialProps = async () => {
  // a check to see whether we are on the server or browser. This will determine the url we use when making requests
  if (typeof window === 'undefined') {
    // we are on the server
    const { data } = await axios
      .get(
        // the first part of this domain is how we make cross namespace requests within our k8s cluster. Since this request is made during server side
        // rendering it's made from within the client pod in our cluster. We need a way to reach our from this pod to the auth pod. There are
        // several different approaches. We chose to make a request to the ingress-controller and let the ingress route the request to the
        // auth service

        // we specify the service and then the namespace
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',
        {
          headers: {
            Host: 'ticketing.dev',
          },
        }
      )
      .catch((err) => console.log(err));

    return data;
  } else {
    // we are on the browser
    const { data } = await axios
      .get('/api/users/currentuser')
      .catch((err) => console.log(err));

    return data;
  }
};

export default LandingPage;
