import { Link, Outlet } from "react-router-dom";
import "./rootLayout.css";
import { useAuth } from "../../context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const RootLayout = () => {
  const { user, logout } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="rootLayout">
        <header>
          <Link to="/" className="logo">
            <img src="/logo.png" alt="" />
            <span>CHATBOT</span>
          </Link>
          <div className="user">
            {user ? (
              <div className="user-menu">
                <span>{user.name}</span>
                <button onClick={logout}>Logout</button>
              </div>
            ) : (
              <Link to="/sign-in">Sign In</Link>
            )}
          </div>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </QueryClientProvider>
  );
};

export default RootLayout;
