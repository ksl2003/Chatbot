import { Outlet, useNavigate } from "react-router-dom";
import "./dashboardLayout.css";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import ChatList from "../../components/chatList/ChatList";

const DashboardLayout = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Auth state:', { user, loading });
    if (!loading && !user) {
      console.log('Redirecting to sign-in...');
      navigate("/sign-in");
    }
  }, [loading, user, navigate]);

  if (loading) {
    console.log('Still loading...');
    return "Loading...";
  }

  if (!user) {
    console.log('No user found');
    return null;
  }

  return (
    <div className="dashboardLayout">
      <div className="menu"><ChatList/></div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
