import 'bootstrap/dist/css/bootstrap.css';

// When we navigate to a distinct page with nextjs , nextjs imports our component from the relevant file. Next wraps our component
// inside its own default component. This component is referred to inside next as the app.

// In this file we are defining our own custom app component. Our components will be passed into this component as the Component prop
// pageProps will be the props that we had intended on passing to our component

const MyApp = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default MyApp;
