import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { ReactMic } from 'react-mic';
import { IoArrowBackSharp } from 'react-icons/io5';
import { CiImageOn } from 'react-icons/ci';
import '../Component/Style folder/Home.css'
import { IoChatbubblesOutline } from "react-icons/io5";

const Chat = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('Ln Token');

  const [user, setUser] = useState({});
  const [showFriends, setShowFriends] = useState([]);
  const [currentChatProfile, setCurrentChatProfile] = useState({});
  const [typeText, setTypeText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [socket, setSocket] = useState(null);
  const [first, setFirst] = useState(true);
  const [secondd, setsecondd] = useState(false);

  const [third, setThird] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editedText, setEditedText] = useState('');



  useEffect(() => {
    axios.get('http://localhost:4345/users/verify', {
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
    const identity = user._id;
    try {
      const res = await axios.post('http://localhost:4345/users/fetch', { identity });
      setShowFriends(res.data.arr);
    } catch (error) {
      // Handle error
    }
  };

  useEffect(() => {
    getAllFriends();
  }, [user && user._id]);

  useEffect(() => {
    // Initialize the socket connection
    const newSocket = io('http://localhost:4345');
    setSocket(newSocket);

    // Event listener for successful connection
    newSocket.on('connect', () => {
      console.log('Connected to server');
    });

    newSocket.on('userTyping', () => {
      setIsTyping(true);
    });

    newSocket.on('userNotTyping', () => {
      setIsTyping(false);
    });
   
    // Event listener for receiving messages
    newSocket.on('receiveMessage', async (message) => {
      console.log(message.content);
      console.log(message.content)
     await setMessages((prevMessages) => [...prevMessages, message]);
    });

    newSocket.on('receiveImage', async(message) => {
      if (message) {
        
        console.log(message);
        await  setMessages((prevMessages) => [...prevMessages, message])
      }else{
        alert("Not message")
      }
    });
    newSocket.on("receiveVoiceNote" , (audiomessage)=>{
      if (audiomessage) {
        
        console.log(audiomessage);
        setMessages((prevMessages)=> [...prevMessages, audiomessage])
      }else{
        console.log("no voiceNote");
      }
    })
    // Event listener for chat history
    newSocket.on('chatHistory',async (history) => {
      console.log(history);
     await setMessages(history);
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
        senderId: user._id,
        recipient: currentChatProfile._id,
        content: typeText.trim(),
        timestamp: new Date().toISOString(),
      });
      setTypeText('');
     
    }
  };
  const sendImage =()=>{
    if (socket && selectedImage !== '') {
      socket.emit("sendImage",{
        senderId: user._id,
        recipient: currentChatProfile._id,
        ImageData: selectedImage,
        timestamp: new Date().toISOString(),
      })
      setSelectedImage(null);
      setThird(false)
    }
  }
 let result
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      result = reader.result;
      if (!result) {
        console.log("No picture uploaded");
      }
      
      setSelectedImage(result)
    };
    
  };

  const handleTyping = () => {
    if (socket) {
      socket.emit('startTyping', user._id);
    }
  };

  const handleStopTyping = () => {
    if (socket) {
      socket.emit('stopTyping', user._id);
    }
  };

  const joinRoom = (senderId, recipient) => {
    socket.emit('joinRoom', { senderId, recipient });
  };

  const pressMe = (el) => {
    setCurrentChatProfile(el);
    setFirst(false);
    setsecondd(true)
    const senderId = user._id;
    const recipient = el._id;
    joinRoom(senderId, recipient);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    hours %= 12;
    hours = hours || 12; // Handle midnight (0 hours)
    return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes} ${period}`;
  };

  const formatDate = (timestamp) => {
    const today = new Date();
    const messageDate = new Date(timestamp);
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      if (messageDate.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
      } else {
        return messageDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
      }
    }
  };

  
  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const onData = (recordedData) => {
    console.log('Recorded audio data:', recordedData);
    // You can do something with the recorded audio data if needed
  };

  const onStop = (recordedBlob) => {
    console.log('Recorded audio blob:', recordedBlob);
    setRecordedAudio(recordedBlob.blob);
  };

  const handleSendVoiceNote = () => {
    if (socket && recordedAudio) {
      // Convert recorded audio Blob to base64 string
      const reader = new FileReader();
      reader.readAsDataURL(recordedAudio);
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1]
        // console.log(base64String);
        // Send base64 string to the backend
        socket.emit('sendVoiceNote', {
          senderId: user._id,
        recipient: currentChatProfile._id,
          audio: base64String,
        });

      };
      alert('voice note sent')
    }
  };
  
  const handleEdit = (messageId, originalText) => {
    console.log(messageId, originalText)
    // Set the message ID and original text in state
    setEditingMessageId(messageId);
    setEditedText(originalText);
  };
  const handleSaveEdit = (messageId) => {
    if (socket && editedText.trim() !== '') {
      // Emit an edit message event to the backend
      socket.emit('editMessage', { messageId, newText: editedText });
      setEditingMessageId(null);
    }
  };
  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditedText('');
  };
  const goBack = () => {
    setFirst(true);
    setsecondd(false)
  };

  const camera = () => {
    setThird(true);
  };
  
  let currentDay = null;

  return (
    <section className='bg-dark text-light h-100'>
      {first && (
        <div>
          {showFriends && showFriends.map((el, i) => (
            <div key={i} onClick={() => pressMe(el)}>
              <main>
                <img src={el.profilePic} className='bluh' alt='' />
                <span>{el.username}</span>
              </main>
            </div>
          ))}
        </div>
      )}
      {secondd && (
        <main className='bg-dark text-light shadow-lg'>
          <div>
            <p onClick={goBack} className='fs-3 position-fixed end-0'>
              <IoArrowBackSharp />
            </p>
          </div>
          <div>
            <img src={currentChatProfile.profilePic} className='bluh' alt='' />
            <span>{currentChatProfile.username}</span>
            {isTyping && currentChatProfile._id !== user._id && <div>Typing...</div>}
          </div>
          <div className='position-fixed bottom-0 start-0 bg-success w-100 p-2 end-0 '>
          <div className='d-flex align-items-center'>
                        <p onClick={camera} className='bg-light  text-dark'><CiImageOn /></p>
            {/* <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }}> */}
              <input
                className='form-control'
                type='text'
                value={typeText}
                placeholder='Enter your message'
                onChange={(e) => { setTypeText(e.target.value); handleTyping(); }}
                onBlur={handleStopTyping}
              />
            
              <button className='btn btn-dark border border-1 border-bg-primary-subtle rounded' onClick={sendMessage} type='submit'>Send</button>
          </div>
          <div className='d-flex align-items-center'>
          <ReactMic
          className='h-25 w-25'
        record={isRecording}
        onStop={onStop}
        onData={onData}
        mimeType="audio/webm"
      />
      <button onClick={startRecording} disabled={isRecording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        Stop Recording
      </button>
      <button onClick={handleSendVoiceNote} disabled={!recordedAudio}>
        Send Voice Note
      </button>

          </div>
            </div>
          <div>
            {third && (
              <center>
                <input type='file' accept='image/*' onChange={handleImageChange} className='text-dark' />
                <button onClick={sendImage}>send</button>
              </center>
            )}
     {messages && messages.map((message, i) => {
  const formattedDate = formatDate(message.timestamp);
  let messageContent = null;

  if (formattedDate !== currentDay) {
    currentDay = formattedDate;
    messageContent = (
      <div key={i} className='reverse'>
        <center className='bg-info text-light'><span className="bg-black text-warning" >{1 + i}<IoChatbubblesOutline /></span> {currentDay}</center>
        <div className='bg-danger text-light'>
          {message.content.map((el, j) => (
            <div key={j}>
              {el.type === 'text' && !el.isEditing && user._id === message.sender && (
                <div>
                  <p>{el.value}</p>
                  <button onClick={() => handleEdit(el._id, el.value)}>Edit</button>
                </div>
              )}
              {el.type === 'text' && el.isEditing && editingMessageId === el._id && (
                <div className='bg-warning text-primary position-fixed top-50 '>
                  <input
                    type="text"
                    className='form-control'
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                  />
                  <button onClick={() => handleSaveEdit(el._id)}>Save</button>
                  <button onClick={handleCancelEdit}>Cancel</button>
                </div>
              )}
              {el.type === 'image' && (
                <img src={el.value} className='w-25 rounded rounded-2' alt='Sent Image' />
              )}
              {el.type === 'audio' && (
                <audio controls src={el.value}></audio>
              )}
              {/* Add more conditions for other types if needed */}
            </div>
          ))}
        </div>
        <p className='bg-info text-light'>{formatTimestamp(message.timestamp)}</p>
      </div>
    );
  } else {
    messageContent = (
      <div key={i}>
        {message.content.map((el, j) => (
          <div key={j}>
            {/* {el.type === 'text' && !el.isEditing && user._id === message.sender && (
              <div>
                <p>{el.value}</p>
                <button onClick={() => handleEdit(el._id, el.value)}>Edit</button>
              </div>
            )}
            {el.type === 'text' && el.isEditing && editingMessageId === el._id && (
              <div>
                <input
                  type="text"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                />
                <button onClick={() => handleSaveEdit(el._id)}>Save</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </div>
            )} */}

{el.type === 'text' && !el.isEditing && user._id === message.sender && (
  <div>
    <p>{el.value}</p>
    <button onClick={() => handleEdit(el._id, el.value)}>Edit</button>
  </div>
)}
{el.type === 'text' && el.isEditing && editingMessageId === el._id && (
  <div className='bg-warning text-primary position-fixed top-50 '>
    <input
      type="text"
      className='form-control'
      value={editedText}
      onChange={(e) => setEditedText(e.target.value)}
    />
    <button onClick={() => handleSaveEdit(el._id)}>Save</button>
    <button onClick={handleCancelEdit}>Cancel</button>
  </div>
)}

            {el.type === 'image' && (
              <img src={el.value} className='w-25 rounded rounded-2' alt='Sent Image' />
            )}
            {el.type === 'audio' && (
              <audio controls src={el.value}></audio>
            )}
            {/* Add more conditions for other types if needed */}
          </div>
        ))}
        <p className='bg-info text-light'>{formatTimestamp(message.timestamp)}</p>
      </div>
    );
  }
  return messageContent;
})}


          </div>
        </main>
      )}
    </section>
  );
};

export default Chat;
