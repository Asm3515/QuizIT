import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { LoginPage, loader as loginLoader, action as loginAction } from './pages/LoginPage.jsx';
import { SignUpPage, action as signUpAction } from './pages/SignUpPage.jsx';
import { LandingPage } from './pages/LandingPage.jsx'; // Import LandingPage
import ErrorBoundary from './components/ErrorBoundry.jsx';
import './index.css';

const router = createBrowserRouter([
  
  {
    path: "/login",
    element: <LoginPage />,
    loader: loginLoader,
    action: loginAction,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/signup",
    element: <SignUpPage />,
    loader: loginLoader,
    action: loginAction,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "*",
    element: <LandingPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
