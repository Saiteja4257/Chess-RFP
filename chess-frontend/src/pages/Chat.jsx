import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import "../styles/chat.css";
// ✅ Initialize socket only once
const socket = io("https://chess-rfp-41oy.onrender.com", {
  autoConnect: false,
});

const Chat = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [userId] = useState(localStorage.getItem("userId") || "");
  const [selectedUser, setSelectedUser] = useState("");
  const bottomRef = useRef(null);

  // ✅ Scroll to bottom when messages update
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (userId) {
      socket.connect();
      socket.emit("joinChat", userId);
      console.log("✅ Connected and joined chat as:", userId);
    }

    // ✅ Fetch users on load
    axios.get("https://chess-rfp-41oy.onrender.com/api/users")
      .then((res) => {
        setUsers(res.data);
        console.log("✅ Users fetched:", res.data);
      })
      .catch((err) => console.error("❌ Error fetching users:", err));

    // ✅ Socket listeners
    socket.on("updateUsers", (userList) => {
      console.log("🔄 Users updated:", userList);
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
      console.log("❌ Disconnected from socket");
    };
  }, [userId, selectedUser, navigate]);

  // ✅ Fetch chat history when selectedUser changes
  useEffect(() => {
    if (selectedUser && userId) {
      axios.get(`https://chess-rfp-41oy.onrender.com/api/messages/${userId}/${selectedUser}`)
        .then((res) => {
          setMessages(res.data);
          console.log("📜 Chat history loaded:", res.data);
        })
        .catch((err) => console.error("❌ Error fetching chat history:", err));
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
      const response = await axios.post("https://chess-rfp-41oy.onrender.com/api/messages", newMessage);
      console.log("✅ Message saved:", response.data);

      socket.emit("sendMessage", newMessage);
      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
    } catch (error) {
      console.error("❌ Error sending message:", error);
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
    <div className="chat-wrapper">
  {/* Left Side: Chat Area */}
  <div className="chat-section">
    <h3>💬 Chat: {selectedUser || "None"}</h3>

    <div className="chat-box">
      {messages.map((msg, index) => (
        <p key={index} className={`message ${msg.sender === userId ? "you" : "other"}`}>
          <strong>{msg.sender === userId ? "You" : msg.sender}:</strong> {msg.text}
        </p>
      ))}
      <div ref={bottomRef} />
    </div>

    <div className="input-row">
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

    <div className="buttons-row">
      <button onClick={invitePlayer} disabled={!selectedUser}>🎮 Invite</button>
      <button onClick={() => navigate("/dashboard")}>🔙 Dashboard</button>
    </div>
  </div>

  {/* Right Side: User List */}
  <div className="user-list hide-scrollbar">
    <h3>🟢 Users</h3><br></br>
    {users.map((user) => (
      <div
        key={user._id}
        className={`user-item ${user._id === selectedUser ? "selected" : ""}`}
      >
        <p>{user.username}<br /></p><br></br>
        {user._id !== userId && (
          <button onClick={() => setSelectedUser(user._id)}>Chat</button>
        )}
      </div>
    ))}
  </div>
</div>


  );
};

export default Chat;
