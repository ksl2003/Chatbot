import { Link } from "react-router-dom";
import "./chatList.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";

const ChatList = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const { isPending, error, data } = useQuery({
    queryKey: ["userChats"],
    queryFn: async () => {
      const token = getToken();
      return fetch(`${import.meta.env.VITE_API_URL}/api/userchats/`, {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json());
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (chatId) => {
      const token = getToken();
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}/delete/`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["userChats"]);
    },
  });

  const handleDelete = (e, chatId) => {
    e.preventDefault();
    deleteMutation.mutate(chatId);
  };

  return (
    <div className="chatList">
      <span className="title">DASHBOARD</span>
      <Link to="/dashboard">Create a new Chat</Link>
      <Link to="/">Explore ChatBot</Link>
      <Link to="/">Contact</Link>
      <hr />
      <span className="title">RECENT CHATS</span>
      <div className="list">
        {isPending
          ? "Loading..."
          : error
          ? "Something went wrong!"
          : data?.map((chat) => (
              <div key={chat._id} style={{ display: "flex", alignItems: "center" }}>
                <Link to={`/dashboard/chats/${chat._id}`} style={{ flex: 1 }}>
                  {chat.title}
                </Link>
                <button
                  className="delete-chat-btn"
                  onClick={(e) => handleDelete(e, chat._id)}
                  title="Delete chat"
                  style={{ marginLeft: 8 }}
                >
                  &#10005;
                </button>
              </div>
            ))}
      </div>
      <hr />
    </div>
  );
};

export default ChatList;
