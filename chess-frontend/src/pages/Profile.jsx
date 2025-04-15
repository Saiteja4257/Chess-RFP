import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css"; // Link to external CSS file

const Profile = () => {
    const navigate=useNavigate();
    const username = localStorage.getItem("username");
    const userId = localStorage.getItem("userId");

    const [stats, setStats] = useState({
        matchesPlayed: 0,
        matchesWon: 0,
        matchesLost: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`https://chess-rfp-41oy.onrender.com/api/profile/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setStats({
                    matchesPlayed: res.data.matchesPlayed,
                    matchesWon: res.data.matchesWon,
                    matchesLost: res.data.matchesLost,
                });
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError("Failed to load profile stats.");
                setLoading(false);
            }
        };

        if (userId) fetchStats();
    }, [userId]);

    if (!username || !userId) {
        return <p className="profile-message error">You're not logged in.</p>;
    }

    if (loading) {
        return <p className="profile-message loading">Loading profile...</p>;
    }

    if (error) {
        return <p className="profile-message error">{error}</p>;
    }

    return (
        <div className="profile-container">
            <div className="profile-card">
                <h2 className="profile-title">User Profile</h2>
                <hr className="profile-divider"/>
                <div className="profile-info">
                    <p><span className="profile-label">Username:</span> {username}</p>
                    <p><span className="profile-label">User ID:</span> {userId}</p>
                </div>

                <hr className="profile-divider" />

                <h3 className="profile-subtitle">Match Stats</h3>
                <div className="profile-stats">
                    <p><span className="profile-stat-label">Matches Played:</span> {stats.matchesPlayed}</p>
                    <p><span className="profile-stat-label">Matches Won:</span> {stats.matchesWon}</p>
                    <p><span className="profile-stat-label">Matches Lost:</span> {stats.matchesLost}</p>
                </div>
                <div className="bt">
                          <button onClick={()=> navigate("/login")}className="pgo-btn">
                             Logout
                            </button>
                            <button className="pgo-btn"  onClick={()=> navigate("/dashboard")}>Dashboard</button>
                            </div>
            </div>
        </div>
    );
};

export default Profile;
