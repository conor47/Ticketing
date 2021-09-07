import 'bootstrap/dist/css/bootstrap.css';

import buildClient from '../api/build-client';

// When we navigate to a distinct page with nextjs , nextjs imports our component from the relevant file. Next wraps our component
// inside its own default component. This component is referred to inside next as the app.

// In this file we are defining our own custom app component. Our components will be passed into this component as the Component prop
// pageProps will be the props that we had intended on passing to our component

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <h1>Header {currentUser.email}</h1>
      <Component {...pageProps} />;
    </div>
  );
};

// inside of the custom app component getInitialprops receives a different arguement as it does in regular pages. There is a ctx property
// on the passed arguement that contains the information we want ie the req and res
AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');
  // to get multiple getInitalProps functions to work we must call them from the custom app component. The component being loaded can be accessed
  // through the appContexts Component property as below. Note we pass down the exptected context
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
