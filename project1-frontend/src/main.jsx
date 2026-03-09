import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';
import store, { persistor } from './redux/store';
import './index.css';
import './i18n';
import { PersistGate } from 'redux-persist/integration/react';
import Loader from './component/Loader/Loader';

console.log("DEBUG: All imports loaded");

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <BrowserRouter>
        <ChakraProvider>
          <Suspense fallback={<Loader />}>
            <App />
          </Suspense>
        </ChakraProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
