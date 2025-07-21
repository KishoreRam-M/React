You're in a great place to learn about Protected Routes in React Router v6+\! This is a fundamental pattern for any application requiring user authentication.

We'll build a complete example with a reusable `ProtectedRoute` component, authentication context, and persistent login.

-----

## Implementing a Protected Route in React using `react-router-dom` v6+

The core idea of a protected route is to act as a gatekeeper. Before rendering a private component, it checks if a user is authenticated. If they are, access is granted. If not, they're redirected to a login page.

Here's how we'll break it down:

1.  **Authentication Context:** A central place to manage authentication state (`user`, `login`, `logout`).
2.  **`ProtectedRoute` Component:** The reusable component that performs the authentication check and redirection.
3.  **Login Page:** Where users can authenticate.
4.  **Dashboard/Protected Page:** The content that requires authentication.
5.  **App Setup:** Integrating everything with `react-router-dom`.
6.  **Persistent Login (Bonus):** Using `localStorage` to remember login state across sessions.

-----

### Step 1: Project Setup

First, let's create a new React project and install `react-router-dom`.

```bash
# Create a new React project using Vite (recommended)
npm create vite@latest my-protected-routes-app -- --template react-ts
cd my-protected-routes-app

# Install dependencies
npm install react-router-dom
# Or if you prefer Yarn
# yarn create vite my-protected-routes-app --template react-ts
# cd my-protected-routes-app
# yarn add react-router-dom
```

### Step 2: Authentication Context (`AuthContext.tsx`)

This context will hold our user's authentication state and provide `login` and `logout` functions.

Create a new file: `src/contexts/AuthContext.tsx`

```tsx
// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the shape of our user object
interface User {
  id: string;
  username: string;
  role?: string; // Optional: for role-based access control
}

// Define the shape of our authentication context
interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoadingAuth: boolean; // To indicate if we are checking for persistent login
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component to wrap our application
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true); // Initially true to check localStorage

  // Bonus: Persist login state using localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      localStorage.removeItem('currentUser'); // Clear invalid data
    } finally {
      setIsLoadingAuth(false); // Finished checking localStorage
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // --- Simulate an API call for login ---
    setIsLoadingAuth(true); // Set loading while we "authenticate"
    return new Promise(resolve => {
      setTimeout(() => { // Simulate network delay
        if (username === 'user' && password === 'password') {
          const newUser: User = { id: '1', username: 'loggedInUser', role: 'user' };
          setUser(newUser);
          localStorage.setItem('currentUser', JSON.stringify(newUser)); // Persist
          setIsLoadingAuth(false);
          resolve(true); // Login successful
        } else if (username === 'admin' && password === 'admin') {
          const newUser: User = { id: '2', username: 'adminUser', role: 'admin' };
          setUser(newUser);
          localStorage.setItem('currentUser', JSON.stringify(newUser)); // Persist
          setIsLoadingAuth(false);
          resolve(true); // Login successful
        }
        else {
          setUser(null);
          localStorage.removeItem('currentUser'); // Ensure no stale data
          setIsLoadingAuth(false);
          resolve(false); // Login failed
        }
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser'); // Clear from localStorage
  };

  const value = { user, login, logout, isLoadingAuth };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to consume the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### Step 3: Reusable `ProtectedRoute` Component (`ProtectedRoute.tsx`)

This component will check the authentication status from `AuthContext` and decide whether to render its children or redirect.

Create a new file: `src/components/ProtectedRoute.tsx`

```tsx
// src/components/ProtectedRoute.tsx
import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[]; // Optional prop for role-based access control
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles = [] }) => {
  const { user, isLoadingAuth } = useAuth();
  const location = useLocation(); // Get current location to redirect back after login

  // While checking localStorage, show a loading indicator
  if (isLoadingAuth) {
    return <div>Loading authentication state...</div>;
  }

  // 1. Check if user is authenticated
  if (!user) {
    // If not authenticated, redirect to the login page
    // `state` stores the current location, so we can redirect back after successful login.
    // `replace` replaces the current entry in the history stack, so the user can't
    // just click the back button to get to the protected page without logging in.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Optional: Check for role-based access control
  if (allowedRoles.length > 0 && user.role && !allowedRoles.includes(user.role)) {
    // If user's role is not in the allowedRoles, redirect to an unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }

  // 3. If authenticated (and authorized), render the requested component
  return children;
};

export default ProtectedRoute;
```

### Step 4: Page Components

Let's create some simple page components.

Create `src/pages/HomePage.tsx`:

```tsx
// src/pages/HomePage.tsx
import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div>
      <h2>Welcome to the Home Page!</h2>
      <p>This is public content.</p>
    </div>
  );
};

export default HomePage;
```

Create `src/pages/DashboardPage.tsx`:

```tsx
// src/pages/DashboardPage.tsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, {user?.username}!</p>
      <p>This is a protected page. Only authenticated users can see this.</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default DashboardPage;
```

Create `src/pages/AdminPage.tsx`:

```tsx
// src/pages/AdminPage.tsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const AdminPage: React.FC = () => {
  const { user, logout } = useAuth();
  return (
    <div>
      <h2>Admin Panel</h2>
      <p>Hello, {user?.username}!</p>
      <p>This page is only accessible by users with the 'admin' role.</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default AdminPage;
```

Create `src/pages/LoginPage.tsx`:

```tsx
// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoadingAuth } = useAuth(); // Destructure isLoadingAuth
  const navigate = useNavigate();
  const location = useLocation();

  // Get the path the user was trying to access before being redirected to login
  // Defaults to '/' if no 'from' state is available
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    const success = await login(username, password);
    if (success) {
      // Use useNavigate to redirect the user to the original protected page
      // `replace: true` ensures the login page is not in the history stack,
      // so clicking back won't take them to login again.
      navigate(from, { replace: true });
    } else {
      setError('Invalid username or password.');
    }
  };

  // Prevent login attempts while authentication is in progress (e.g., checking localStorage or API call)
  if (isLoadingAuth) {
    return <div>Loading authentication state...</div>;
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isLoadingAuth} // Disable input during authentication
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoadingAuth} // Disable input during authentication
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={isLoadingAuth}>
          {isLoadingAuth ? 'Logging in...' : 'Log In'}
        </button>
      </form>
      <p>Try: user/password or admin/admin</p>
    </div>
  );
};

export default LoginPage;
```

Create `src/pages/UnauthorizedPage.tsx`:

```tsx
// src/pages/UnauthorizedPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage: React.FC = () => {
  return (
    <div>
      <h2>Unauthorized Access</h2>
      <p>You do not have permission to view this page.</p>
      <Link to="/">Go to Home</Link>
    </div>
  );
};

export default UnauthorizedPage;
```

### Step 5: Main Application Setup (`App.tsx` and `main.tsx`)

Now, let's set up the main `App` component and wrap it with `BrowserRouter` and `AuthProvider`.

Update `src/App.tsx`:

```tsx
// src/App.tsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Import your pages
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

const App: React.FC = () => {
  return (
    <AuthProvider> {/* Wrap your entire application with AuthProvider */}
      <div style={{ padding: '20px' }}>
        <nav style={{ marginBottom: '20px' }}>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', gap: '15px' }}>
            <li><Link to="/">Home (Public)</Link></li>
            <li><Link to="/dashboard">Dashboard (Protected)</Link></li>
            <li><Link to="/admin">Admin (Protected, Admin Role)</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </nav>

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Role-based Protected Route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all route for 404 Not Found */}
          <Route path="*" element={<h2>404: Not Found</h2>} />
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default App;
```

Ensure your `src/main.tsx` (or `src/index.tsx`) correctly wraps `App` with `BrowserRouter`.

```tsx
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css'; // Optional: your global styles
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter> {/* Wrap your App with BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
```

### Step 6: Run Your Application

```bash
npm run dev
# or
yarn dev
```

Open your browser to `http://localhost:5173` (or whatever port Vite provides).

### How to Test:

1.  **Go to `/` (Home):** You should see "Welcome to the Home Page\!".
2.  **Go to `/dashboard`:** You will be redirected to `/login`. Notice the URL: `http://localhost:5173/login?from=/dashboard`. This `from` query param (or state, as we use `location.state` here) is crucial.
3.  **Login:** Enter `user` for username and `password` for password. Click "Log In".
      * You should be redirected back to `/dashboard`.
      * If you log out, you can try logging in with `admin`/`admin`.
4.  **Go to `/admin` without admin role:** Log in as `user/password`. Then try to navigate to `/admin`. You should be redirected to `/unauthorized`.
5.  **Go to `/admin` with admin role:** Log out. Log in as `admin/admin`. Then navigate to `/admin`. You should see the Admin Panel content.

-----

### Key Takeaways and Explanation:

1.  **`AuthContext` (`src/contexts/AuthContext.tsx`):**

      * It acts as your **single source of truth** for authentication status (`user`).
      * It provides `login` and `logout` functions that simulate API calls and update the `user` state.
      * The `isLoadingAuth` state is vital:
          * It's `true` initially to indicate that the app is checking for persistent login (e.g., from `localStorage`).
          * It becomes `false` once this check is complete.
          * It also briefly becomes `true` during actual login/logout processes to prevent UI interaction.
      * **Bonus: Persistent Login:** The `useEffect` hook in `AuthProvider` tries to load the user from `localStorage` on component mount. If a user is found, they are automatically logged in. When `login` or `logout` are called, `localStorage` is updated accordingly. This means if you close your browser tab and reopen it, you'll still be logged in (unless you manually log out or clear localStorage).

2.  **`ProtectedRoute` (`src/components/ProtectedRoute.tsx`):**

      * This is a **reusable HOC (Higher-Order Component) pattern** (or in this case, a component that takes `children`).
      * **`useAuth()`:** It uses our custom `useAuth` hook to get the current user status and the `isLoadingAuth` flag.
      * **`useLocation()`:** It captures the current URL (`location`). If a user is redirected to login, this `location` object is passed in the `state` prop of `Maps`. This allows the `LoginPage` to know *where* to send the user back after successful login.
      * **Loading State:** Before making a decision, it checks `isLoadingAuth`. This prevents a flicker where an unauthenticated user might momentarily see a protected page *before* `localStorage` is checked.
      * **Authentication Check (`if (!user)`):** If `user` is `null` (not authenticated), it renders `<Navigate to="/login" state={{ from: location }} replace />`.
          * `to="/login"`: Specifies the destination path.
          * `state={{ from: location }}`: Passes the current `location` object as `state` to the login route. The `LoginPage` can then read this state using `useLocation()` to know where to redirect the user after they log in successfully.
          * `replace`: This is crucial\! It tells React Router to *replace* the current entry in the browser's history stack instead of pushing a new one. This means if you navigate to `/dashboard`, get redirected to `/login`, and then click the back button, you won't go back to `/dashboard` (which you aren't allowed to see), but rather to the page *before* you tried to access `/dashboard`.
      * **Role-Based Access Control (`allowedRoles` prop):** The `ProtectedRoute` can optionally accept an `allowedRoles` array. If provided, it further checks if the authenticated user's `role` (from `AuthContext`) is included in this array. If not, it redirects to `/unauthorized`. This makes your `ProtectedRoute` component very versatile.
      * **Render Children:** If all checks pass (authenticated and authorized), `children` are rendered, allowing the user to view the protected content.

3.  **`LoginPage` (`src/pages/LoginPage.tsx`):**

      * **`useNavigate()`:** After a successful login, `Maps(from, { replace: true })` is used to programmatically redirect the user. The `from` variable (derived from `location.state`) ensures they go back to the page they originally intended to visit.
      * The `replace: true` here serves the same purpose as in `ProtectedRoute` – it prevents the login page from being in the browser history, so the user can't "back" into it.

This robust setup provides a secure and user-friendly way to manage protected routes in your React applications with `react-router-dom` v6+.
