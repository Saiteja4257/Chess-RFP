import { useState ,useEffect} from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Guidelines/Login.css"
const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        document.body.classList.add("login-page");
    
        return () => {
          document.body.classList.remove("login-page");
        };
      }, []);
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("https://chess-rfp-41oy.onrender.com/login", formData);
    
            // Store token, userId, and username in localStorage
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("userId", res.data.userId);
            localStorage.setItem("username", res.data.username);  // 👈 Add this line
    
            alert("Login Successful");
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };
    

    return (
        <div className="login-container"  >
            <div className="ltext-content">
            <h2 className="login-heading" >Login</h2>
            
            {error && <p  className="login-error" style={{ color: "red" }}>{error}</p>}<br></br>
            
            <form onSubmit={handleSubmit} className="login-form" >
                <input className="login-input" type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input className="login-input" type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <button className="login-button" type="submit">Login</button>
            </form><br></br>
            <p  className="login-footer">Don't have an account? <Link className="login-link" to="/register">Register here</Link></p>
            </div>
            <img className="lck" src="/kingdom2.png" alt=""></img>
        </div>
    );
};

export default Login;

