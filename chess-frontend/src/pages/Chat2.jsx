import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import "./Chat2.css";

const socket = io("https://chess-rfp-41oy.onrender.com", { autoConnect: false });

const Chat = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [userId] = useState(localStorage.getItem("userId") || "");
  const [selectedUser, setSelectedUser] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (userId) {
      socket.connect();
      socket.emit("joinChat", userId);
    }

    axios.get("https://chess-rfp-41oy.onrender.com/api/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching users:", err));

    socket.on("updateUsers", (userList) => {
      setUsers((prev) => [...new Set([...prev, ...userList])]);
    });

    socket.on("receiveMessage", (data) => {
      if (
        (data.receiver === userId || data.sender === userId) &&
        (data.sender === selectedUser || data.receiver === selectedUser)
      ) {
        setMessages((prev) => [...prev, data]);
      }
    });

    socket.on("invitePlayer", ({ fromUser }) => {
      if (window.confirm(`${fromUser} invited you to play! Accept?`)) {
        navigate("/");
      }
    });

    return () => {
      socket.disconnect();
      socket.off("receiveMessage");
      socket.off("updateUsers");
      socket.off("invitePlayer");
    };
  }, [userId, selectedUser, navigate]);

  useEffect(() => {
    if (selectedUser && userId) {
      axios.get(`https://chess-rfp-41oy.onrender.com/api/messages/${userId}/${selectedUser}`)
        .then((res) => setMessages(res.data))
        .catch((err) => console.error("Error fetching chat history:", err));
    }
  }, [userId, selectedUser]);

  const sendMessage = async () => {
    if (!message.trim() || !selectedUser) {
      alert("Please select a user and type a message.");
      return;
    }

    const newMessage = {
      sender: userId,
      receiver: selectedUser,
      text: message,
    };

    try {
      await axios.post("https://chess-rfp-41oy.onrender.com/api/messages", newMessage);
      socket.emit("sendMessage", newMessage);
      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const invitePlayer = () => {
    if (!selectedUser) {
      alert("Please select a user to invite.");
      return;
    }
    socket.emit("invitePlayer", { fromUser: userId, toUser: selectedUser });
    alert(`Game invite sent to ${selectedUser}`);
  };

  return (
    <div className="chat2">
    <div className="chat2-wrapper chat2-hide-scrollbar">
      <div className="chat2-section">
        <h3>💬 Chat: {selectedUser || "None"}</h3>

        <div className="chat2-box chat2-hide-scrollbar">
          {messages.map((msg, index) => (
            <p key={index} className={`chat2-msg ${msg.sender === userId ? "chat2-you" : "chat2-other"}`}>
              <strong>{msg.sender === userId ? "You" : msg.sender}:</strong> {msg.text}
            </p>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="chat2-input-row">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            disabled={!selectedUser}
          />
          <button onClick={sendMessage} disabled={!selectedUser}>Send</button>
        </div>

        <div className="chat2-buttons-row">
          <button onClick={invitePlayer} disabled={!selectedUser}>🎮 Invite</button>
          <button onClick={() => navigate("/dashboard")}>🔙 Dashboard</button>
        </div>
      </div>

      <div className="chat2-user-list chat2-hide-scrollbar">
        <h3>🟢 Users</h3><br />
        {users.map((user) => (
          <div
            key={user._id}
            className={`chat2-user-item ${user._id === selectedUser ? "chat2-selected" : ""}`}
          >
            <p>{user.username}<br /></p><br />
            {user._id !== userId && (
              <button onClick={() => setSelectedUser(user._id)}>Chat</button>
            )}
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default Chat;
