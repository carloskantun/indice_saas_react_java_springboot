import { createBrowserRouter, redirect } from 'react-router';
import App from './App';
import { LoginPage } from './Auth';
import { authApi } from './api/auth';

const redirectToLanding = async () => {
  const session = await authApi.getSessionOrNull();
  return redirect(session ? '/dashboard' : '/login');
};

const redirectIfAuthenticated = async () => {
  const session = await authApi.getSessionOrNull();

  if (session) {
    return redirect('/dashboard');
  }

  return null;
};

const requireAuthenticatedSession = async () => {
  const session = await authApi.getSessionOrNull();

  if (!session) {
    return redirect('/login');
  }

  return null;
};

export const router = createBrowserRouter([
  {
    path: '/',
    loader: redirectToLanding,
  },
  {
    path: '/login',
    element: <LoginPage />,
    loader: redirectIfAuthenticated,
  },
  {
    path: '/:pageId/*',
    element: <App />,
    loader: requireAuthenticatedSession,
  },
]);
