// import "./chatPage.css";
// import NewPrompt from "../../components/newPrompt/NewPrompt";
// import { useQuery } from "@tanstack/react-query";
// import { useLocation } from "react-router-dom";
// import Markdown from "react-markdown";
// import { IKImage } from "imagekitio-react";
// import { useAuth } from "../../context/AuthContext";
// import { useEffect, useRef } from "react"; // Import useEffect and useRef

// const ChatPage = () => {
//   const path = useLocation().pathname;
//   const chatId = path.split("/").pop();
//   const { getToken } = useAuth();

//   const chatEndRef = useRef(null); // Create a ref for the end of the chat

//   const { isPending, error, data } = useQuery({
//     queryKey: ["chat", chatId],
//     queryFn: async () => {
//       const token = getToken();
//       const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
//         credentials: "include",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (!response.ok) {
//         throw new Error('Failed to fetch chat');
//       }
//       return response.json();
//     },
//   });

//   // Scroll to the bottom of the chat whenever new data arrives
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [data]);

//   if (isPending) {
//     return <div className="chatPage loading">Loading chat...</div>; // Added loading class
//   }

//   if (error) {
//     return <div className="chatPage error">Error loading chat: {error.message}</div>; // Added error class
//   }

//   if (!data || !data.history) { // Check for data.history existence
//     return <div className="chatPage empty">No chat data found. Start a conversation!</div>; // Added empty class
//   }

//   return (
//     <div className="chatPage">
//       <div className="wrapper">
//         <div className="chat">
//           {data.history.map((message, i) => (
//             <div
//               key={i}
//               className={`message-container ${message.role === "user" ? "user-message-container" : "bot-message-container"}`}
//             >
//               {message.img && (
//                 <IKImage
//                   urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
//                   path={message.img}
//                   height="300"
//                   width="400"
//                   transformation={[{ height: 300, width: 400 }]}
//                   loading="lazy"
//                   lqip={{ active: true, quality: 20 }}
//                 />
//               )}
//               <div
//                 className={`message ${message.role === "user" ? "user" : "bot"}`}
//               >
//                 <Markdown>{message.parts[0].text}</Markdown>
//               </div>
//             </div>
//           ))}
//           <div ref={chatEndRef} /> {/* Element to scroll into view */}
//         </div>
//       </div>
//       <NewPrompt data={data} />
//     </div>
//   );
// };

// export default ChatPage;




import "./chatPage.css";
import NewPrompt from "../../components/newPrompt/NewPrompt";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import Markdown from "react-markdown";
import { IKImage } from "imagekitio-react";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useRef } from "react"; // Import useEffect and useRef
import userAvatar from '/human1.jpg';
import botAvatar from '/bot.png';

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const ChatPage = () => {
  const path = useLocation().pathname;
  const chatId = path.split("/").pop();
  const { getToken } = useAuth();

  const chatEndRef = useRef(null); // Create a ref for the end of the chat

  const { isPending, error, data } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const token = getToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}/`, {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch chat');
      }
      return response.json();
    },
  });

  // Scroll to the bottom of the chat whenever new data arrives
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data]);

  if (isPending) {
    return <div className="chatPage loading">Loading chat...</div>; // Added loading class
  }

  if (error) {
    return <div className="chatPage error">Error loading chat: {error.message}</div>; // Added error class
  }

  if (!data || !data.history) { // Check for data.history existence
    return <div className="chatPage empty">No chat data found. Start a conversation!</div>; // Added empty class
  }

  return (
    <div className="chatPage">
      <div className="wrapper">
        <div className="chat">
          {data.history.map((message, i) => (
            <div
              key={i}
              className={`message-container ${message.role === "user" ? "user-message-container" : "bot-message-container"}`}
            >
              <div className="message-row">
                <img
                  className="avatar"
                  src={message.role === 'user' ? userAvatar : botAvatar}
                  alt={message.role === 'user' ? 'User' : 'Bot'}
                />
                <div
                  className={`message fade-in ${message.role === "user" ? "user" : "bot"}`}
                >
                  <Markdown>{message.parts[0].text}</Markdown>
                </div>
              </div>
              <div className="timestamp">
                {message.createdAt ? formatTime(message.createdAt) : ''}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </div>
      <NewPrompt data={data} />
    </div>
  );
};

export default ChatPage;