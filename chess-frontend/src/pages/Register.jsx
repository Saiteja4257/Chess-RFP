import { useState,useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Guidelines/Register1.css";
const Register = () => {
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        document.body.classList.add("register-page");
    
        return () => {
          document.body.classList.remove("register-page");
        };
      }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("https://chess-rfp-41oy.onrender.com/register", formData);
            alert(res.data.message);
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="register-container">
            <div className="rtext-content">
            <h2 className="register-heading">Register</h2>
            {error && <p style={{ color: "red" }} className="register-error">{error}</p>}<br></br>
            <form onSubmit={handleSubmit} className="register-form" >
                <input type="text" name="username" placeholder="Username" className="register-input" onChange={handleChange} required />
                <input type="email" name="email" className="register-input" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="password" className="register-input" placeholder="Password" onChange={handleChange} required />
                <button type="submit" className="register-button" >Register</button>
            </form><br></br>
            <p className="register-footer" >Already registered? <Link to="/login" className="register-link" >Login here</Link></p>
            </div>
            <img className="rck" src="/ChessKing2.png" alt=""></img>
        </div>
    );
};

export default Register;
