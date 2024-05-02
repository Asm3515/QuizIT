import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import { ErrorPage } from './pages/ErrorPage.jsx';
import { SignUpPage, action as signUpAction } from './pages/SignUpPage.jsx';
import { LoginPage, loader as loginLoader, action as loginAction } from './pages/LoginPage.jsx';
import { AuthChecker } from './components/AuthChecker.jsx';
import './index.css';
import { SearchResultsPage } from './pages/SearchResultsPage.jsx';
import { TopRomanticSongs } from './pages/topcharts/Romantic.jsx';
import { TopWorkoutSongs } from './pages/topcharts/Workout.jsx';
import { TopDanceSongs } from './pages/topcharts/Dance.jsx';
import { TopMelancholicSongs } from './pages/topcharts/Melancholic.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <AuthChecker />,
      },
      {
        path: "signup/",
        element: <Outlet />,
        action: signUpAction,
        children: [
          {
            path: "",
            element: <SignUpPage />,
            loader: loginLoader,
            action: signUpAction,
          }
        ],
      },
      {
        path: "login/",
        element: <LoginPage />,
        loader: loginLoader,
        action: loginAction,
      },
      {
        path: "search/:searchTerm",
        element: <SearchResultsPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "topcharts/romantic",
        element: <TopRomanticSongs />,
        errorElement: <ErrorPage />,
      },
      {
        path: "topcharts/workout",
        element: <TopWorkoutSongs />,
        errorElement: <ErrorPage />,
      },
      {
        path: "topcharts/dance",
        element: <TopDanceSongs />,
        errorElement: <ErrorPage />,
      },
      {
        path: "topcharts/melancholic",
        element: <TopMelancholicSongs />,
        errorElement: <ErrorPage />,
      }
    ],
  },
  {
    path: "/user/:id",
    element: <h1>Hello</h1>,
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
