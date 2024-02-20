import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { set } from 'lodash';

const Chat = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("Ln Token");

  const [User, setUser] = useState({});
  const [showFriends, setShowFriends] = useState([]);
  const [currentChatProfile, setCurrentChatProfile] = useState({});
  const [typeText, setTypeText] = useState("");
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [P, setP] = useState(false);
  const [first, setfirst] = useState(true)
  // const [second, setsecond] = useState(false)

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
    const newSocket = io('http://localhost:4345');
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('message', (message) => {
        setMessages(prevMessages => [...prevMessages, message]);
      });

      socket.on('userTyping', () => {
        setIsTyping(true);
      });

      socket.on('userNotTyping', () => {
        setIsTyping(false);
      });
    }
  }, [socket]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (socket) {
      const value = {
        senderId: User._id,
        receiverId: currentChatProfile._id,
        content: typeText,
        timestamp: new Date().toISOString(),
      };
      try {
        await axios.post('http://localhost:4345/users/BestPost', { value });
        setTypeText('');
      } catch (error) {
        // Handle error
      }
    }
  };

  const handleTyping = () => {
    setP(true);
    socket.emit('startTyping');
  };

  const handleStopTyping = () => {
    setP(false);
    socket.emit('stopTyping');
  };

  const pressMe = (el, i) => {
    setfirst(false)
    // setSe
    setCurrentChatProfile(el);
  };

  return (
    <section className='bg-dark text-light h-100'>
    {first&&   <div>
        {showFriends && showFriends.map((el, i) => (
          <div key={i} onClick={() => pressMe(el, i)}>
            <main>
              <img src={el.profilePic} className='bluh' alt="" />
              <span>{el.username}</span>
            </main>
          </div>
        ))}
      </div>}
      <main className='bg-dark text-light shadow-lg'>
        <div>
          <img src={currentChatProfile.profilePic} className="bluh" alt="" />
          <span>{currentChatProfile.username}</span>
          {isTyping && currentChatProfile._id !== User._id && <div>Typing...</div>}
          {/* {currentChatProfile._id === User._id ?  "its me " : "its not me"} */}
        </div>
        <div>
          <form onSubmit={sendMessage}>
            <input 
              type="text" 
              value={typeText} 
              placeholder='Enter your message' 
              onChange={(e) => {
                setTypeText(e.target.value);
                handleTyping();
              }} 
              onBlur={handleStopTyping} 
            />
            <span><button type='submit'>Send</button></span>
          </form>
        </div>
      </main>
      <div>
        {messages && messages.map((el, i) => (
          <div key={i}>
            <p>{el}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Chat;
