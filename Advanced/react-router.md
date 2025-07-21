## 🔰 1. Introduction

### What is React Router?

React Router is a popular open-source library that enables **declarative routing** in React applications. In essence, it helps you manage and navigate between different "pages" or views within your Single-Page Application (SPA) without requiring a full page reload from the server.

### Why use React Router instead of traditional page reloads?

Traditionally, when you click a link on a website, the browser makes a new request to the server, and the server sends back a completely new HTML page. This causes a full page reload, which can be slow and jarring for the user.

React Router, and client-side routing in general, addresses this by:

  * **Preventing full page reloads:** Instead of requesting a new HTML page, React Router intercepts navigation requests and dynamically updates the UI to reflect the new "page" or view. This results in a much smoother, faster, and more app-like experience.
  * **Managing the URL:** It keeps the browser's URL in sync with the current UI state, allowing users to bookmark pages, use the browser's back/forward buttons, and share direct links (deep linking).

### Key benefits:

  * **SPA Routing:** The core benefit is enabling the Single-Page Application paradigm, where content is loaded dynamically without full page refreshes.
  * **Dynamic Routes:** Allows you to create routes that contain variable parts (e.g., `/users/123`, where `123` is a user ID), making it easy to display specific content based on data.
  * **Nested Routing:** Enables you to define routes within routes, which is perfect for complex layouts and hierarchical UIs (e.g., a dashboard with sub-sections).
  * **Code Splitting/Lazy Loading:** Integrate with React's `lazy` and `Suspense` to load route components only when they are needed, significantly improving initial load times.
  * **Programmatic Navigation:** Provides hooks and components to navigate users around your application based on logic (e.g., redirecting after login).
  * **Data Loading:** In recent versions, React Router provides powerful mechanisms to fetch data *before* a component renders, preventing "loading spinners" on every page transition.

-----

## ⚙️ 2. Installation & Setup

### How to install React Router (react-router-dom)

React Router is typically installed via `npm` or `yarn`. For web applications, you'll use `react-router-dom`.

```bash
npm install react-router-dom
# or
yarn add react-router-dom
```

### Setting up BrowserRouter at the root

The most common way to set up React Router is by wrapping your entire application with a `BrowserRouter` component. This component uses the HTML5 History API to keep your UI in sync with the URL.

**`src/index.js` (or `src/main.jsx` for Vite):**

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css'; // Your global styles

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

### Creating a basic route structure

Inside your `App.js` (or a dedicated `Routes.js` file), you'll define your routes using `Routes` and `Route` components.

**`src/App.js`:**

```jsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

// Import your page components
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';

function App() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        {/* A fallback route for 404 Not Found */}
        <Route path="*" element={<h1>404: Not Found</h1>} />
      </Routes>
    </div>
  );
}

export default App;
```

**`src/pages/Home.js`:**

```jsx
import React from 'react';

function Home() {
  return <h2>Welcome to the Home Page!</h2>;
}

export default Home;
```

**`src/pages/About.js`:**

```jsx
import React from 'react';

function About() {
  return <h2>Learn more about us!</h2>;
}

export default About;
```

**`src/pages/Contact.js`:**

```jsx
import React from 'react';

function Contact() {
  return <h2>Get in touch with us!</h2>;
}

export default Contact;
```

### Difference between BrowserRouter, HashRouter, MemoryRouter

React Router offers different types of routers, each suited for specific environments:

  * **`BrowserRouter` (Recommended for most web apps):**

      * Uses the HTML5 History API (`pushState`, `replaceState`) to keep the UI in sync with the URL.
      * Creates clean, readable URLs (e.g., `yourwebsite.com/about`).
      * Requires server-side configuration for production to serve the `index.html` file for all routes, so direct URL access or refreshes on sub-routes don't result in a 404.

  * **`HashRouter`:**

      * Uses the URL hash (`#`) to keep the UI in sync with the URL (e.g., `yourwebsite.com/#/about`).
      * Does **not** require server-side configuration because the hash part of the URL is never sent to the server.
      * URLs are less aesthetically pleasing and generally not good for SEO.
      * Useful for static file hosting (e.g., GitHub Pages) where you can't configure the server.

  * **`MemoryRouter`:**

      * Keeps the history in memory and does not read or write to the URL.
      * Useful for testing React components that use React Router or for non-browser environments like React Native.
      * The URL in the browser's address bar doesn't change.

For the vast majority of web applications, `BrowserRouter` is the preferred choice due to its clean URLs and better SEO potential.

-----

## 🛣️ 3. Core Components & APIs

### `<Routes>` and `<Route>`

  * **`<Routes>`:** This component is the successor to `<Switch>` from older React Router versions. It renders the *first* `<Route>` that matches the current URL.
      * **Key improvement over `<Switch>`:** In v6, `<Routes>` intelligently picks the best match, so the order of your `<Route>` components generally doesn't matter for basic matching (though it can for more complex scenarios with nested routes and wildcards).
  * **`<Route>`:** Defines a single route.
      * `path`: The URL path to match (e.g., `/`, `/about`, `/users/:id`).
      * `element`: The React component to render when the path matches.

**Example:**

```jsx
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import About from './About';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}
```

### `<Link>` vs `<NavLink>`

Both are used to create links for navigation within your application.

  * **`<Link>`:** A basic component for navigating to a new URL. It renders an `<a>` tag in the DOM.

    ```jsx
    import { Link } from 'react-router-dom';

    <Link to="/products">View Products</Link>
    ```

  * **`<NavLink>`:** Similar to `<Link>`, but it automatically adds an `active` class to the rendered `<a>` tag when the current URL matches the `to` prop. This is incredibly useful for styling active navigation items (e.g., highlighting the current page in a navigation bar).

      * You can customize the class name or inline styles using a callback function in the `className` or `style` props, which receives an `isActive` boolean.

    <!-- end list -->

    ```jsx
    import { NavLink } from 'react-router-dom';

    <NavLink
      to="/dashboard"
      className={({ isActive }) => isActive ? 'active-link' : 'inactive-link'}
      style={({ isActive }) => ({
        color: isActive ? 'blue' : 'black',
        fontWeight: isActive ? 'bold' : 'normal',
      })}
    >
      Dashboard
    </NavLink>
    ```

### `useNavigate()` for programmatic navigation

The `useNavigate` hook returns a function that lets you navigate programmatically. This is useful when you need to navigate based on an event (e.g., form submission, API call success) rather than a simple link click.

```jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    // ... authentication logic ...
    const isAuthenticated = true; // Assume successful login

    if (isAuthenticated) {
      navigate('/dashboard'); // Navigate to the dashboard
      // navigate(-1); // Go back one step in history
      // navigate('/dashboard', { replace: true }); // Replace current history entry
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginForm;
```

### `useParams()` for accessing route params

When you define dynamic segments in your route paths (e.g., `/users/:id`), `useParams` allows you to extract those values from the URL.

```jsx
import React from 'react';
import { useParams } from 'react-router-dom';

function UserProfile() {
  const { id } = useParams(); // 'id' matches the ':id' in the route path

  return (
    <div>
      <h2>User Profile</h2>
      <p>User ID: {id}</p>
      {/* Fetch and display user data based on 'id' */}
    </div>
  );
}

// In your Routes:
// <Route path="/users/:id" element={<UserProfile />} />
```

### `useLocation()` and `useSearchParams()`

  * **`useLocation()`:** Returns the current `location` object, which represents the current URL. This object contains useful properties like `pathname`, `search` (query string), `hash`, and `state` (data passed during navigation).

    ```jsx
    import React from 'react';
    import { useLocation } from 'react-router-dom';

    function CurrentPageInfo() {
      const location = useLocation();

      return (
        <div>
          <h3>Current Location Info:</h3>
          <p>Pathname: {location.pathname}</p>
          <p>Search Query: {location.search}</p>
          <p>Hash: {location.hash}</p>
          {location.state && <p>State: {JSON.stringify(location.state)}</p>}
        </div>
      );
    }
    ```

  * **`useSearchParams()`:** A convenient hook for working with URL query parameters (the part of the URL after `?`). It returns a `URLSearchParams` object and a setter function to update the query parameters.

    ```jsx
    import React from 'react';
    import { useSearchParams } from 'react-router-dom';

    function ProductList() {
      const [searchParams, setSearchParams] = useSearchParams();
      const category = searchParams.get('category') || 'all';
      const sortBy = searchParams.get('sortBy') || 'name';

      const handleCategoryChange = (e) => {
        setSearchParams({ category: e.target.value, sortBy }); // Updates the URL: ?category=electronics&sortBy=name
      };

      const handleSortChange = (e) => {
        setSearchParams({ category, sortBy: e.target.value }); // Updates the URL: ?category=all&sortBy=price
      };

      return (
        <div>
          <h2>Products</h2>
          <div>
            Filter by Category:
            <select value={category} onChange={handleCategoryChange}>
              <option value="all">All</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
            </select>
          </div>
          <div>
            Sort by:
            <select value={sortBy} onChange={handleSortChange}>
              <option value="name">Name</option>
              <option value="price">Price</option>
            </select>
          </div>
          <p>Showing products for category: {category}</p>
          <p>Sorted by: {sortBy}</p>
          {/* Display products based on category and sortBy */}
        </div>
      );
    }

    // Example URL: /products?category=electronics&sortBy=price
    ```

-----

## 🧩 4. Nested Routes

Nested routes are fundamental for structuring complex applications where parts of your UI are dependent on the parent route. Think of a dashboard with different sections (settings, profile, orders) or a blog with a list of posts and individual post views.

### How to define and render nested routes

You define nested routes by placing `<Route>` components inside another `<Route>` component. The `path` of the child route is relative to its parent.

```jsx
import React from 'react';
import { Routes, Route, Outlet, Link } from 'react-router-dom';

// Layout component for the dashboard
function DashboardLayout() {
  return (
    <div>
      <h1>Dashboard</h1>
      <nav>
        <ul>
          <li><Link to="profile">Profile</Link></li> {/* Relative path: /dashboard/profile */}
          <li><Link to="settings">Settings</Link></li> {/* Relative path: /dashboard/settings */}
        </ul>
      </nav>
      <hr />
      {/* This is where the nested route's element will be rendered */}
      <Outlet />
    </div>
  );
}

function DashboardProfile() {
  return <h3>User Profile Settings</h3>;
}

function DashboardSettings() {
  return <h3>Application Settings</h3>;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<h2>Home</h2>} />
      <Route path="/dashboard" element={<DashboardLayout />}>
        {/* Child routes are rendered within the <Outlet /> of DashboardLayout */}
        <Route index element={<h4>Welcome to your Dashboard!</h4>} /> {/* Default child route for /dashboard */}
        <Route path="profile" element={<DashboardProfile />} />
        <Route path="settings" element={<DashboardSettings />} />
      </Route>
      <Route path="*" element={<h1>404: Not Found</h1>} />
    </Routes>
  );
}

export default App;
```

### Using `<Outlet />` to display nested route components

The `<Outlet />` component acts as a placeholder where the matched child route's `element` will be rendered. When a parent route matches, its `element` is rendered, and then the `<Outlet />` inside it renders the child's `element`.

In the example above, `DashboardLayout` renders the `<h1>Dashboard</h1>`, `nav`, and `<hr />`, and then `DashboardProfile` or `DashboardSettings` will appear where `<Outlet />` is placed.

### Layout components and shared UI between routes

Nested routes are ideal for creating layout components that provide shared UI (headers, footers, sidebars) for a group of routes. The `DashboardLayout` in the example serves this purpose, providing a consistent structure for all dashboard-related pages. This promotes code reusability and maintainability.

-----

## 🧑‍🔧 5. Dynamic Routing

Dynamic routing allows you to create routes that match patterns in the URL, enabling you to display specific content based on variable parts of the path.

### Route parameters: `/users/:id`

You define route parameters by prefixing a segment in the `path` with a colon (`:`).
Example: `/users/:id`, `/products/:categorySlug/:productId`.

```jsx
// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserProfile from './UserProfile';
import ProductDetail from './ProductDetail';

function App() {
  return (
    <Routes>
      <Route path="/users/:userId" element={<UserProfile />} />
      <Route path="/products/:category/:productId" element={<ProductDetail />} />
    </Routes>
  );
}

// UserProfile.js
import React from 'react';
import { useParams } from 'react-router-dom';

function UserProfile() {
  const { userId } = useParams(); // 'userId' matches ':userId' in the path

  return (
    <div>
      <h2>User Profile</h2>
      <p>Displaying profile for User ID: {userId}</p>
      {/* Fetch user data using userId */}
    </div>
  );
}

// ProductDetail.js
import React from 'react';
import { useParams } from 'react-router-dom';

function ProductDetail() {
  const { category, productId } = useParams();

  return (
    <div>
      <h2>Product Detail</h2>
      <p>Category: {category}</p>
      <p>Product ID: {productId}</p>
      {/* Fetch product data using category and productId */}
    </div>
  );
}
```

### Accessing params with `useParams()`

As shown above, the `useParams()` hook is your primary tool for accessing these dynamic segment values. It returns an object where keys are the parameter names (without the colon) and values are the corresponding parts of the URL.

### Query parameters handling

Query parameters (e.g., `?name=John&age=30`) are not part of the route path itself but provide additional information. `useSearchParams()` is specifically designed to handle them.

```jsx
import React from 'react';
import { useSearchParams } from 'react-router-dom';

function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  const page = parseInt(searchParams.get('page')) || 1;

  const handleSearchChange = (e) => {
    setSearchParams({ query: e.target.value, page: 1 }); // Reset page on new search
  };

  const goToNextPage = () => {
    setSearchParams({ query, page: page + 1 });
  };

  return (
    <div>
      <h2>Search Results</h2>
      <input
        type="text"
        value={query}
        onChange={handleSearchChange}
        placeholder="Search..."
      />
      <p>Searching for: "{query}" on page {page}</p>
      <button onClick={goToNextPage}>Next Page</button>
      {/* Display search results based on query and page */}
    </div>
  );
}

// In your Routes:
// <Route path="/search" element={<SearchResults />} />
// Example URL: /search?query=react+router&page=2
```

### Route wildcard: `*` for 404 handling

The `*` (splat) character acts as a wildcard, matching any remaining part of the URL. It's commonly used to catch all unmatched routes and display a 404 "Not Found" page. The wildcard route should typically be the *last* route defined within `<Routes>`.

```jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import NotFound from './pages/NotFound'; // Create this component

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      {/* Catch-all route for any unmatched paths */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

// src/pages/NotFound.js
import React from 'react';

function NotFound() {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
}

export default NotFound;
```

-----

## 🔐 6. Protected Routes (Authentication)

Protecting routes is a common requirement in applications that involve user authentication. You want to prevent unauthorized users from accessing certain parts of your application.

### Implementing private routes (login protected)

The core idea is to check if the user is authenticated. If not, redirect them to a login page.

**1. Authentication Context (for managing auth state):**
It's often helpful to manage authentication state globally using React Context or a state management library.

```jsx
// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate here

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Or load from localStorage/sessionStorage

  // Simulate persistent login (e.g., checking a token)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (username, password) => {
    // In a real app, this would involve API calls
    if (username === 'test' && password === 'password') {
      const newUser = { id: 1, name: 'Test User', role: 'user' };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = { user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
```

**2. Private Route Component:**
This component acts as a wrapper around the routes you want to protect.

```jsx
// src/components/RequireAuth.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function RequireAuth({ children, allowedRoles = [] }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to the login page, but save the current location they were trying to access
    // so we can redirect them back after successful login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to an unauthorized page or dashboard if role doesn't match
    return <Navigate to="/unauthorized" replace />;
  }

  return children; // If authenticated and authorized, render the child routes/elements
}

export default RequireAuth;
```

**3. Integrating with Routes:**

```jsx
// src/App.js
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import RequireAuth from './components/RequireAuth';

// Page Components
function Home() { return <h2>Home Page</h2>; }
function PublicPage() { return <h2>Public Content</h2>; }
function Dashboard() { return <h2>Dashboard - Private Content</h2>; }
function AdminPanel() { return <h2>Admin Panel - Admin Only</h2>; }
function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard'; // Get original path

  const handleLogin = () => {
    if (login('test', 'password')) {
      navigate(from, { replace: true }); // Redirect back to original path or dashboard
    } else {
      alert('Login failed!');
    }
  };

  return (
    <div>
      <h2>Login Page</h2>
      <button onClick={handleLogin}>Log In (test/password)</button>
    </div>
  );
}
function UnauthorizedPage() { return <h2>Unauthorized Access</h2>; }


function App() {
  return (
    <AuthProvider> {/* Wrap your entire app with AuthProvider */}
      <div>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/public">Public Page</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/admin">Admin Panel</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/public" element={<PublicPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          } />
          <Route path="/admin" element={
            <RequireAuth allowedRoles={['admin']}> {/* Only 'admin' role can access */}
              <AdminPanel />
            </RequireAuth>
          } />

          <Route path="*" element={<h1>404: Not Found</h1>} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
```

### Redirecting with `Maps`

The `Maps` component is a declarative way to trigger a redirection. It's often used within conditional rendering, as seen in `RequireAuth`.

```jsx
// Inside RequireAuth.js
if (!user) {
  return <Navigate to="/login" state={{ from: location }} replace />;
}
```

The `replace` prop is important: it replaces the current entry in the history stack, so the user can't simply click the back button to bypass the protection.

### Role-based access control

As shown in the `RequireAuth` component, you can pass an `allowedRoles` prop to restrict access further based on the user's role. This adds another layer of protection.

### Persistent login using context/auth state

By storing the user's authentication token or state in `localStorage` (or `sessionStorage`), you can re-authenticate the user on page refresh, providing a persistent login experience. The `useEffect` in `AuthContext` demonstrates this.

-----

## 🔁 7. Navigation & Redirection

### `useNavigate()` for redirect after login

This is covered in the `LoginPage` example in the Protected Routes section. After a successful login, `Maps(from, { replace: true })` programmatically redirects the user to the page they were trying to access or a default dashboard, replacing the login page in the history.

### Conditional navigation

You can use `useNavigate()` or `Maps` component to perform conditional navigation based on any application logic.

**Example with `useNavigate()`:**

```jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function OrderConfirmation() {
  const navigate = useNavigate();
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handlePlaceOrder = () => {
    // Simulate API call
    setTimeout(() => {
      setOrderPlaced(true);
      navigate('/order-success', { state: { orderId: 'ABC12345' } });
    }, 1000);
  };

  return (
    <div>
      <h2>Confirm Your Order</h2>
      <button onClick={handlePlaceOrder} disabled={orderPlaced}>
        {orderPlaced ? 'Placing Order...' : 'Place Order'}
      </button>
    </div>
  );
}
```

**Example with `Maps` component:**

```jsx
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';

function PaymentPage() {
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);

  const processPayment = () => {
    // Simulate payment processing
    setTimeout(() => {
      setPaymentSuccessful(true);
    }, 2000);
  };

  if (paymentSuccessful) {
    return <Navigate to="/payment-success" replace />;
  }

  return (
    <div>
      <h2>Payment Details</h2>
      <button onClick={processPayment}>Pay Now</button>
    </div>
  );
}
```

### Redirecting old URLs to new ones

You can manage redirects for old URLs to new ones, especially useful during a website redesign or URL structure change.

```jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<h2>Home</h2>} />
      {/* Old URL /old-about now redirects to /about */}
      <Route path="/old-about" element={<Navigate to="/about" replace />} />
      <Route path="/about" element={<h2>New About Page</h2>} />
      {/* Redirect with a dynamic parameter */}
      <Route path="/old-products/:id" element={<Navigate to="/products/:id" replace />} />
      <Route path="*" element={<h1>404: Not Found</h1>} />
    </Routes>
  );
}
```

-----

## 🔄 8. URL Search Params

`useSearchParams()` is specifically designed for handling URL query parameters. It gives you a `URLSearchParams` object to read values and a setter function to update them.

### Managing filters/sort/search using `useSearchParams`

This is a prime use case for `useSearchParams`.

```jsx
import React from 'react';
import { useSearchParams } from 'react-router-dom';

function ProductCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get('category') || '';
  const sortBy = searchParams.get('sortBy') || 'price';
  const searchTerm = searchParams.get('q') || '';

  const handleFilterChange = (e) => {
    setSearchParams(prev => {
      prev.set('category', e.target.value);
      prev.set('page', '1'); // Reset page when filter changes
      return prev;
    });
  };

  const handleSortChange = (e) => {
    setSearchParams(prev => {
      prev.set('sortBy', e.target.value);
      return prev;
    });
  };

  const handleSearchTermChange = (e) => {
    setSearchParams(prev => {
      prev.set('q', e.target.value);
      prev.set('page', '1');
      return prev;
    });
  };

  // Example of removing a param
  const clearSearch = () => {
    setSearchParams(prev => {
      prev.delete('q');
      return prev;
    });
  };

  return (
    <div>
      <h2>Product Catalog</h2>
      <div>
        <label>
          Search:
          <input type="text" value={searchTerm} onChange={handleSearchTermChange} />
          <button onClick={clearSearch}>Clear Search</button>
        </label>
      </div>
      <div>
        <label>
          Category:
          <select value={category} onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="electronics">Electronics</option>
            <option value="books">Books</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Sort By:
          <select value={sortBy} onChange={handleSortChange}>
            <option value="price">Price</option>
            <option value="name">Name</option>
          </select>
        </label>
      </div>
      <p>Current filters: Category: {category || 'None'}, Sort By: {sortBy}, Search: {searchTerm || 'None'}</p>
      {/* Render products based on these parameters */}
    </div>
  );
}

// URL examples:
// /products?category=electronics&sortBy=price&q=laptop
// /products?q=book
```

### Reading and updating query parameters

  * **Reading:** Use `searchParams.get('paramName')`.
  * **Updating:** The `setSearchParams` function can take:
      * An object: `{ key: 'value', ... }` (This will completely replace all existing search parameters).
      * A function: `(prevSearchParams) => newSearchParams` (This allows you to modify existing search parameters without losing others. `prevSearchParams` is a `URLSearchParams` object).
        When using the functional update, remember that `URLSearchParams` objects are mutable, so you can modify `prevSearchParams` directly or create a new one. The example above demonstrates modifying `prev` directly.

-----

## 🌐 9. Real-World Use Cases

Let's combine concepts into mini-project ideas.

### Building a multi-page app (Home, About, Contact, Dashboard)

This is essentially what we've been building throughout the examples. The core structure involves a `BrowserRouter` at the root, a `Routes` component with multiple `Route` definitions, and `Link`/`NavLink` for navigation.

```jsx
// src/App.js (simplified)
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
```

### Admin Panel with nested and dynamic routes

An Admin Panel is a perfect candidate for nested and dynamic routes, often combined with protected routes.

```jsx
// src/App.js (partial, focus on admin routes)
import React from 'react';
import { Routes, Route, Link, Outlet } from 'react-router-dom';
import RequireAuth from './components/RequireAuth'; // Assume you have this from above
import { useAuth } from './contexts/AuthContext';

function AdminLayout() {
  const { user, logout } = useAuth();
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user?.name} ({user?.role})</p>
      <button onClick={logout}>Logout</button>
      <nav>
        <ul>
          <li><Link to="/admin">Dashboard Overview</Link></li>
          <li><Link to="/admin/users">Manage Users</Link></li>
          <li><Link to="/admin/products">Manage Products</Link></li>
          <li><Link to="/admin/settings">Settings</Link></li>
        </ul>
      </nav>
      <hr />
      <Outlet /> {/* Renders nested admin components */}
    </div>
  );
}

function AdminOverview() { return <h3>Admin Overview</h3>; }
function UserList() { return <h3>User Management</h3>; }
function UserDetail() {
  const { userId } = useParams();
  return <h4>User Detail for ID: {userId}</h4>;
}
function ProductManagement() { return <h3>Product Management</h3>; }
function AdminSettings() { return <h3>Admin Settings</h3>; }

function App() {
  return (
    <Routes>
      {/* ... other public routes ... */}
      <Route path="/admin" element={
        <RequireAuth allowedRoles={['admin']}>
          <AdminLayout />
        </RequireAuth>
      }>
        <Route index element={<AdminOverview />} />
        <Route path="users" element={<UserList />} />
        <Route path="users/:userId" element={<UserDetail />} /> {/* Dynamic route for user detail */}
        <Route path="products" element={<ProductManagement />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
      {/* ... 404 route ... */}
    </Routes>
  );
}
```

### Blog App with route-based article loading

A blog is a classic example for dynamic routes.

```jsx
// src/App.js (partial, focus on blog routes)
import React from 'react';
import { Routes, Route, Link, Outlet } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const blogPosts = [
  { id: 'react-router-guide', title: 'Mastering React Router', content: '...' },
  { id: 'component-lifecycle', title: 'React Component Lifecycle', content: '...' },
];

function BlogLayout() {
  return (
    <div>
      <h1>Our Blog</h1>
      <nav>
        <ul>
          {blogPosts.map(post => (
            <li key={post.id}>
              <Link to={`/blog/${post.id}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <hr />
      <Outlet /> {/* Renders either the post list or a single post */}
    </div>
  );
}

function BlogPostList() {
  return (
    <div>
      <h3>Latest Posts:</h3>
      <p>Select a post from the sidebar.</p>
    </div>
  );
}

function BlogPostDetail() {
  const { postId } = useParams();
  const post = blogPosts.find(p => p.id === postId);

  if (!post) {
    return <h3>Post not found!</h3>;
  }

  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      {/* More content */}
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* ... other routes ... */}
      <Route path="/blog" element={<BlogLayout />}>
        <Route index element={<BlogPostList />} /> {/* Default for /blog */}
        <Route path=":postId" element={<BlogPostDetail />} /> {/* Dynamic post route */}
      </Route>
      {/* ... 404 route ... */}
    </Routes>
  );
}
```

-----

## ⚙️ 10. Advanced Routing Features

React Router v6 has introduced powerful features that enhance performance and developer experience.

### Lazy loading route components

This is crucial for optimizing initial load times. Instead of bundling all your components into a single file, you can split them into smaller chunks and load them only when the user navigates to a specific route. React Router leverages `React.lazy()` and `React.Suspense` for this.

```jsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load components
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <Suspense fallback={<div>Loading page...</div>}> {/* Fallback for lazy loading */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
```

When a user navigates to `/about`, only the `About.js` chunk will be fetched, rather than the entire application bundle.

### Route loaders (data fetching in routes)

React Router v6.4+ (part of the data APIs) introduced `loader` functions directly on routes. These functions run *before* the component is rendered, allowing you to fetch data declaratively and prevent waterfall effects (where component renders, then fetches data, then re-renders).

To use loaders, you typically need to use `createBrowserRouter` instead of directly `BrowserRouter`.

```jsx
// src/App.js (using createBrowserRouter)
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Link,
  useLoaderData,
  useParams,
  useRouteError // For error handling
} from 'react-router-dom';

// Root Layout (can also fetch data for shared layout)
function RootLayout() {
  return (
    <div>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/posts">Posts</Link></li>
        </ul>
      </nav>
      <hr />
      <Outlet /> {/* Renders matched route element */}
    </div>
  );
}

// Error Page for Data Routers
function ErrorPage() {
  const error = useRouteError(); // Provides access to the error that occurred
  console.error(error);
  return (
    <div>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}

// Posts List Page
function Posts() {
  const posts = useLoaderData(); // Get data from the loader
  return (
    <div>
      <h2>All Posts</h2>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <Link to={`/posts/${post.id}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Loader for Posts List
async function postsLoader() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  if (!response.ok) {
    throw new Response("Not Found", { status: 404, statusText: "Posts not found" });
  }
  const posts = await response.json();
  return posts;
}

// Single Post Page
function PostDetail() {
  const post = useLoaderData(); // Get data from the loader
  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.body}</p>
    </div>
  );
}

// Loader for Single Post
async function postDetailLoader({ params }) {
  const { postId } = params;
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`);
  if (!response.ok) {
    throw new Response("Not Found", { status: 404, statusText: `Post with ID ${postId} not found` });
  }
  const post = await response.json();
  return post;
}

// Create the router
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />, // Global error boundary for this branch
    children: [
      { index: true, element: <h2>Welcome Home!</h2> },
      {
        path: "posts",
        element: <Posts />,
        loader: postsLoader, // Attach the loader here
      },
      {
        path: "posts/:postId",
        element: <PostDetail />,
        loader: postDetailLoader, // Attach the loader here
      },
    ],
  },
  {
    path: "*",
    element: <h1>404: Not Found</h1>
  }
]);

// Render your app with the RouterProvider
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
```

### Error boundaries in routing

With `createBrowserRouter` (data routers), you can define `errorElement` directly on your routes. If an error occurs during rendering, data loading (`loader`), or data mutation (`action`), the `errorElement` component for the nearest matching route will be rendered. You can use `useRouteError()` within your `errorElement` to access the error.

See `ErrorPage` and `errorElement` in the `createBrowserRouter` example above.

### Programmatic back/forward navigation

The `useNavigate()` hook provides a simple way to go back or forward in the browser history stack:

```jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

function GoBackButton() {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(-1)}>Go Back</button> // Go back one step
  );
}

function GoForwardButton() {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(1)}>Go Forward</button> // Go forward one step
  );
}
```

### Route transitions/animations

React Router itself doesn't provide animation capabilities directly, but it provides the necessary hooks and components to integrate with animation libraries like CSS Transitions, React Transition Group, or Framer Motion. The key is to:

1.  **Detect route changes:** `useLocation()` is helpful here.
2.  **Apply CSS classes or animation props:** Based on the location change, trigger animations.

For modern browsers, React Router v6.4+ introduces `viewTransition` prop on `Link` and `NavLink` for seamless animations between views using the [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API). This provides native-like transitions with minimal effort.

```jsx
// Example using viewTransition (requires browser support for View Transitions API)
import React from 'react';
import { Link, NavLink } from 'react-router-dom';

function MyAnimatedNav() {
  return (
    <nav>
      {/* Simply add viewTransition prop to Link or NavLink */}
      <NavLink to="/" viewTransition>Home</NavLink>
      <NavLink to="/gallery" viewTransition>Gallery</NavLink>
    </nav>
  );
}

// For more complex animations with external libraries, you'd typically wrap your <Routes>
// with a component that manages transitions, often involving the useLocation hook.
// This is a more advanced topic and involves careful handling of component mounting/unmounting.
```

-----

## 💡 11. Best Practices

### Route file organization and modular routing

As your application grows, a single `App.js` file with all routes becomes unmanageable.

  * **Centralized Route Definition:** For smaller to medium apps, defining all routes in `App.js` or a dedicated `router.js` is fine.
  * **Feature-based Organization:** For larger applications, organize routes by feature. Each feature might have its own routing module.
    ```
    src/
    ├── App.js
    ├── router.js (if using createBrowserRouter)
    ├── features/
    │   ├── auth/
    │   │   ├── auth.routes.js
    │   │   ├── LoginPage.js
    │   │   └── RegisterPage.js
    │   ├── dashboard/
    │   │   ├── dashboard.routes.js
    │   │   ├── DashboardLayout.js
    │   │   ├── ProfilePage.js
    │   │   └── SettingsPage.js
    │   └── products/
    │       ├── products.routes.js
    │       ├── ProductListPage.js
    │       └── ProductDetailPage.js
    └── pages/
        ├── Home.js
        └── About.js
    ```
    You can then import and combine these route definitions using `children` in `Route` or by building an array of route objects for `createBrowserRouter`.

### SEO tips (if SSR involved)

React Router is primarily for client-side routing, which means content is rendered in the browser. For optimal SEO, search engine crawlers need to see the content.

  * **Server-Side Rendering (SSR):** For serious SEO, especially for content-heavy sites (blogs, e-commerce), combine React Router with SSR (e.g., using frameworks like Next.js or Remix, which often use React Router under the hood or similar concepts). This renders the initial HTML on the server, making it crawlable.
  * **Sitemaps:** Provide a sitemap to search engines.
  * **Pre-rendering (for static sites):** For sites with fixed content, you can pre-render pages into static HTML files at build time.

### Performance tips for large route trees

  * **Lazy Loading:** As discussed, `React.lazy()` and `Suspense` are your best friends for large applications to reduce initial bundle size.
  * **Efficient Route Matching:** React Router v6's `Routes` component is optimized for matching, so explicit ordering isn't as critical as it was with `Switch`.
  * **Route Loaders/Actions:** For data fetching, use loaders to ensure data is available before components render, preventing "flash of unstyled content" or empty states.
  * **Avoid Unnecessary Renders:** Ensure your components are optimized (e.g., `React.memo`, `useCallback`, `useMemo`) to prevent re-renders when route changes don't affect their props.

### Testing routes with React Testing Library

Testing routing behavior is crucial. React Testing Library is excellent for this, often in conjunction with `MemoryRouter`.

```jsx
// src/tests/App.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App'; // Your main App component with routes

// Mocked components for simpler testing
jest.mock('../pages/Home', () => () => <div>Home Page Content</div>);
jest.mock('../pages/About', () => () => <div>About Page Content</div>);
jest.mock('../pages/NotFound', () => () => <div>404 Page Content</div>);

describe('App Routing', () => {
  test('renders Home page at "/"', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Home Page Content')).toBeInTheDocument();
  });

  test('renders About page at "/about"', () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('About Page Content')).toBeInTheDocument();
  });

  test('renders 404 page for unknown route', () => {
    render(
      <MemoryRouter initialEntries={['/non-existent-route']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('404 Page Content')).toBeInTheDocument();
  });

  test('navigates from Home to About when About link is clicked', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('About')); // Click the About Link

    expect(screen.getByText('About Page Content')).toBeInTheDocument();
    expect(screen.queryByText('Home Page Content')).not.toBeInTheDocument();
  });
});
```

-----

## 📘 Bonus

### Compare React Router with Next.js routing

| Feature        | React Router                                  | Next.js Routing (App Router)                          |
| :------------- | :-------------------------------------------- | :---------------------------------------------------- |
| **Type** | Client-Side Routing Library                   | Full-Stack Framework with Built-in Routing            |
| **Rendering** | Primarily Client-Side Rendering (CSR)         | Hybrid: Server Components by default, CSR for `use client` |
| **File-based** | Explicit route configuration (`<Routes>`, `<Route>`) | Convention-based (folders/files in `app` or `pages` directory map to routes) |
| **Data Fetching**| `loader` functions (v6.4+ Data API)          | `async` components, `fetch`, `route handlers` (APIs) |
| **SEO** | Requires SSR setup (e.g., with Express/Node.js) | Excellent built-in SSR/SSG/ISR capabilities          |
| **API Routes** | No built-in API routing                      | Built-in API routes (`route.js` or `api` directory) |
| **Learning Curve**| Lower for basic CSR                 | Higher, more opinionated, full-stack framework     |
| **Use Cases** | SPAs, dashboards, internal tools              | Marketing sites, e-commerce, complex web apps requiring strong SEO and performance |

**When to choose which:**

  * **React Router:** If you're building a pure SPA, a client-side dashboard, or if you prefer to build your own server-side infrastructure. It offers more flexibility if you want to control every aspect of your stack.
  * **Next.js:** If you need strong SEO, fast initial load times, built-in API routes, and a more opinionated, full-stack framework that handles many performance and deployment concerns out of the box. For most modern web projects, Next.js is often the recommended choice, as it abstracts away much of the routing complexity and offers superior performance characteristics.

### Routing in mobile apps (React Native Navigation)

While React Router has a `react-router-native` package, the most widely adopted and robust solution for navigation in React Native applications is **React Navigation**.

**React Native Navigation vs. React Navigation:**

  * **React Navigation:** Written entirely in JavaScript. It provides various navigators (Stack, Tab, Drawer) that mimic native navigation patterns. It's highly customizable and has a large community.
  * **React Native Navigation (from Wix/Mizrak):** Directly uses native navigation APIs (UINavigationController on iOS, Fragments on Android). This can sometimes lead to a more "native" feel and performance, but it can be more complex to set up and customize.

If you're coming from React web development and want a similar declarative routing experience, `react-router-native` might feel familiar. However, for most production-grade React Native apps, **React Navigation** is the standard due to its maturity, feature set, and extensive community support.

### Useful community plugins/tools

  * **`react-router-dom-v6-compat`:** For easier migration from v5 to v6.
  * **`react-router-transition`:** (While some transitions can be done with native APIs or CSS, this library helps with more complex animated transitions between routes, though it might need specific setup for v6).
  * **`react-helmet-async`:** For managing document head (`<title>`, `<meta>` tags) dynamically with client-side routing, crucial for SEO in SPAs (when SSR is not used).
  * **`react-query` or `SWR`:** While React Router now has `loaders`, these data fetching libraries can still be used alongside for component-level data fetching, caching, and state management.

-----

You now have a comprehensive understanding of React Router, from its fundamental concepts to advanced features and best practices. Happy routing\!
