// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import io from 'socket.io-client';
// import { useNavigate } from 'react-router-dom';

// const Chat = () => {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("Ln Token");

//   const [User, setUser] = useState({});
//   const [showFriends, setShowFriends] = useState([]);
//   const [currentChatProfile, setCurrentChatProfile] = useState({});
//   const [typeText, setTypeText] = useState("");
//   const [socket, setSocket] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [isTyping, setIsTyping] = useState(false);

//   useEffect(() => {
//     axios.get("http://localhost:4345/users/verify", {
//       headers: {
//         Authorization: `bearer ${token}`,
//       },
//     })
//     .then((res) => {
//       setUser(res.data.user);
//     })
//     .catch((error) => {
//       // Handle error
//     });
//   }, []);

//   const getAllFriends = async () => {
//     const identity = User._id;
//     try {
//       const res = await axios.post("http://localhost:4345/users/fetch", { identity });
//       setShowFriends(res.data.arr);
//     } catch (error) {
//       // Handle error
//     }
//   };

//   useEffect(() => {
//     getAllFriends();
//   }, [User && User._id]);



//   useEffect(() => {
//     const newSocket = io('http://localhost:4345');
//     setSocket(newSocket);

//     newSocket.on('connect', () => {
//       console.log('Connected to server');
//     });

//     // newSocket.on('receiveMessage', (message) => {
//     //   console.log(message)
//     //   setMessages(prevMessages => [...prevMessages, message])
//     //   console.log(messages)
//     // });

    
   

//     newSocket.on('userTyping', () => {
//       setIsTyping(true);
//     });

//     newSocket.on('userNotTyping', () => {
//       setIsTyping(false);
//     });

//     return () => {
//       newSocket.disconnect();
//     };
//   }, []);
//   useEffect(() => {
//     // Listen for 'receiveMessage' events from the server
//     if (socket) {
//       socket.on('receiveMessage', (message) => {
//         console.log(message);
//         setMessages((prevMessages) => [...prevMessages, message]);
//         console.log(messages);
//       });
//     }
//   }, [socket]);

//   const sendMessage = () => {
//     // Send a message to the server
//     if (socket && typeText.trim() !== '') {
//       socket.emit('sendMessage', {
//        senderId: User._id,
//          recipient: currentChatProfile._id,
//          content: typeText.trim(),
//          timestamp: new Date().toISOString(),
//         // content: inputText.trim(),
//       });
//       setTypeText('');
//     }
//   };
//   const handleTyping = () => {
//     if (socket) {
//       socket.emit('startTyping', User._id);
//     }
//   };

//   const handleStopTyping = () => {
//     if (socket) {
//       socket.emit('stopTyping', User._id);
//     }
//   };

//   const pressMe = (el) => {
//     console.log(el);
//     setCurrentChatProfile(el);
//     const senderId = User._id
//     const recipient = el._id
//     socket.emit('joinRoom', { senderId, recipient});

//   };
  
//     useEffect(()=>{
//   socket.on('chatHistory', (history) => {
//     setMessages(history);
//   });
//    // Cleanup function to remove the event listener when component unmounts
//     return () => {
//       socket.off('chatHistory');
//     };

// },[socket])
//   return (
//     <section className='bg-dark text-light h-100'>
//       <div>
//         {showFriends && showFriends.map((el, i) => (
//           <div key={i} onClick={() => pressMe(el)}>
//             <main>
//               <img src={el.profilePic} className='bluh' alt="" />
//               <span>{el.username}</span>
//             </main>
//           </div>
//         ))}
//       </div>
//       <main className='bg-dark text-light shadow-lg'>
//         <div>
//           <img src={currentChatProfile.profilePic} className="bluh" alt="" />
//           <span>{currentChatProfile.username}</span>
//           {isTyping && currentChatProfile._id !== User._id && <div>Typing...</div>}
//         </div>
//         <div>
//           <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
//             <input 
//               type="text" 
//               value={typeText} 
//               placeholder='Enter your message' 
//               onChange={(e) => { setTypeText(e.target.value); handleTyping(); }} 
//               onBlur={handleStopTyping} 
//             />
//             <span><button type='submit'>Send</button></span>
//           </form>
//         </div>
//       </main>
//       <div>
//         {messages && messages.map((message, i) => (
//           <div key={i}>
//             <p className='bg-danger text-light'>{message.content}</p>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }

// export default Chat;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const Chat = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("Ln Token");

  const [User, setUser] = useState({});
  const [showFriends, setShowFriends] = useState([]);
  const [currentChatProfile, setCurrentChatProfile] = useState({});
  const [typeText, setTypeText] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:4345/users/verify", {
      headers: {
        Authorization: `bearer ${token}`,
      },
    })
    .then((res) => {
      setUser(res.data.user);
    })
    .catch((error) => {
      // Handle error
    });
  }, []);

  const getAllFriends = async () => {
    const identity = User._id;
    try {
      const res = await axios.post("http://localhost:4345/users/fetch", { identity });
      setShowFriends(res.data.arr);
    } catch (error) {
      // Handle error
    }
  };

  useEffect(() => {
    getAllFriends();
  }, [User && User._id]);

  useEffect(() => {
    // Initialize the socket connection
    const newSocket = io('http://localhost:4345');
    setSocket(newSocket);

    // Event listener for successful connection
    newSocket.on('connect', () => {
      console.log('Connected to server');
    });

    // Event listener for receiving messages
    newSocket.on('receiveMessage', (message) => {
      ;
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Event listener for chat history
    newSocket.on('chatHistory', (history) => {
    console.log(history);
      setMessages(history);
    });

    // Cleanup function to disconnect socket when component unmounts
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  const sendMessage = () => {
    // Send a message to the server
    if (socket && typeText.trim() !== '') {
      socket.emit('sendMessage', {
        senderId: User._id,
        recipient: currentChatProfile._id,
        content: typeText.trim(),
        timestamp: new Date().toISOString(),
      });
      setTypeText('');
    }
  };

  const handleTyping = () => {
    if (socket) {
      socket.emit('startTyping', User._id);
    }
  };

  const handleStopTyping = () => {
    if (socket) {
      socket.emit('stopTyping', User._id);
    }
  };

  const joinRoom = (senderId, recipient) => {
    console.log(senderId,recipient);
    socket.emit('joinRoom', { senderId, recipient });
  };

  const pressMe = (el) => {
    setCurrentChatProfile(el);
    const senderId = User._id
    const recipient = el._id
    joinRoom(senderId, recipient);
  };

  return (
    <section className='bg-dark text-light h-100'>
      <div>
        {showFriends && showFriends.map((el, i) => (
          <div key={i} onClick={() => pressMe(el)}>
            <main>
              <img src={el.profilePic} className='bluh' alt="" />
              <span>{el.username}</span>
            </main>
          </div>
        ))}
      </div>
      <main className='bg-dark text-light shadow-lg'>
        <div>
          <img src={currentChatProfile.profilePic} className="bluh" alt="" />
          <span>{currentChatProfile.username}</span>
          {isTyping && currentChatProfile._id !== User._id && <div>Typing...</div>}
        </div>
        <div>
          <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
            <input 
              type="text" 
              value={typeText} 
              placeholder='Enter your message' 
              onChange={(e) => { setTypeText(e.target.value); handleTyping(); }} 
              onBlur={handleStopTyping} 
            />
            <span><button type='submit'>Send</button></span>
          </form>
        </div>
      </main>
      <div>
        {messages && messages.map((message, i) => (
          <div key={i}>
            <p className='bg-danger text-light'>{message.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Chat;

