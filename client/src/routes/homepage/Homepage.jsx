import { Link } from "react-router-dom";
import "./homepage.css";

const Homepage = () => {
  return (
    <div className="homepage">
      <div className="left">
        <h1>CHATBOT</h1>
        <h2>Supercharge your creativity and productivity</h2>
        <Link to="/dashboard">Get Started</Link>
      </div>
      <div className="terms">
        <img src="/logo.png" alt="" />
        <div className="links">
          <Link to="/">Terms of Service</Link>
          <span>|</span>
          <Link to="/">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
