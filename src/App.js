import React from 'react';
import { BrowserRouter as Router, RouterProvider } from 'react-router-dom';
import { routes } from './routers/Routes/Routes';
import { useRoutes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">
       <RouterProvider router={routes}></RouterProvider>
       <Toaster></Toaster>
       <ToastContainer />
    </div>
  );
}


export default App;
