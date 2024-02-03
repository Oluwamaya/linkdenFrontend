import React, { useState, useEffect , useRef, useLayoutEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ImFilePicture } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import { RiArrowGoBackLine } from "react-icons/ri";
import { IoChatbubblesOutline } from "react-icons/io5";
import { BiSolidPhoneCall } from "react-icons/bi";
import { CiMenuKebab } from "react-icons/ci";
import { MdOutlineKeyboardVoice } from "react-icons/md";
import { CiPause1 } from "react-icons/ci";
import { CiPlay1 } from "react-icons/ci";
import { IoStopCircleOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { ReactMic } from "react-mic";


const Chat = () => {
  const [showAllFriend, setshowAllFriend] = useState([]);
  const [display, setdisplay] = useState();
  const [best, setBest] = useState();
  const [receivedId, setReceivedId] = useState(null);
  const [femo, setfemo] = useState(true);
  const [flet, setflet] = useState(false)

  const { allFriend } = useSelector((state) => state.FriendSlice);

  useEffect(() => {
    setshowAllFriend(allFriend);
  }, []); // Empty dependency array to run the effect only once on mount

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("Ln Token");
  const [first, setfirst] = useState({});
  const [inputtext, setinputtext] = useState("");
  const [firs, setfirs] = useState(false);
  const [second, setsecond] = useState(true);
  const [hideEdit, sethideEdit] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:4345/users/verify", {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      .then((res) => {
        // console.log(res.data.user)
        setfirst(res.data.user);
      })
      .catch((error) => {
        console.log(error);
        alert(error.response.data.message);
        navigate("/sign");
      });
  }, []);

  const pressme = (el, i) => {
    setsecond(false);
    setfirs(true);
    setfemo(false);
    setdisplay(el);
    // console.log(el._id);
  };

  useEffect(() => {
    const getmessages = async () => {
      try {
        const userId = (await first) && first._id;
        const friendID = (await display) && display._id;

        await axios
          .get(
            `http://localhost:4345/users/getChatMessages/${userId}/${friendID}`
          )
          .then((res) => {
            if (res.data.messages) {
              setBest(res.data.messages);
              // console.log(best);
            }
          })
          .catch((error) => {
            // console.log(error);
          });

        // Update your state or do something with the fetched data
      } catch (error) {
        console.log(error);
      }
    };

    // Call getmessages initially
    getmessages();
    // Setup interval to call getmessages every 2 seconds
    const intervalId = setInterval(() => {
      getmessages();
    }, 1000);
    // Cleanup: Clear the interval when the component is unmounted or when dependency array changes
    return () => {
      clearInterval(intervalId);
    };
  }, [first._id, display && display._id]);

  useEffect(() => {
    const chatInput = document.getElementById("chatInput");
    if (chatInput) {
      chatInput.value = inputtext;
    }
  }, [inputtext]);

  const sendText = () => {
    const value = {
      receiverId: first._id,
      senderId: display._id,
      content: inputtext,
      messageType: "",
    };
    console.log(value);
    // socket.emit("message", value);
    axios
      .post("http://localhost:4345/users/BestPost", { value })
      .then((res) => {
        console.log(res);
        setinputtext("");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //Editing Message Functions
  const [editing, setEditing] = useState({ isEditing: false, messageId: null });
  const [editedMessage, setEditedMessage] = useState("");

  const toggleEditing = (messageId) => {
    setEditing({ isEditing: !editing.isEditing, messageId });
    setEditedMessage(""); // Clear edited message when toggling editing mode
  };

  const handleEdit = async (el, i) => {
    // Implement the logic to send a POST request to update the chat message
    const updatedMessage = {
      messageId: el._id,
      content: editedMessage,
    };
    console.log(updatedMessage);
    // Modify the endpoint to your actual server endpoint for updating messages
    await axios
      .post("http://localhost:4345/users/updateChatMessage", { updatedMessage })
      .then((response) => {
        // console.log(response.data);
        if (hideEdit) {
          sethideEdit(false);
        }
        // Assuming the server successfully updates the message, update the state accordingly
        const updatedBest = [...best];
        updatedBest[i].content = editedMessage;
        setBest(updatedBest);
        // Toggle off editing mode
        toggleEditing(null);
      })
      .catch((error) => {
        console.error("Error updating message:", error);
        // You may want to handle errors or provide user feedback here
      });
  };

  // Update the handleDelMessage function
  const handleDelMessage = (messageId) => {
    const value = {
      senderId: display._id,
      messageId,
    };
    axios
      .post("http://localhost:4345/users/delete", { value })
      .then((res) => {
        if (
          res.status === 200 &&
          res.data.message === "Message deleted successfully."
        ) {
          if (hideEdit) {
            sethideEdit(false);
          }

          const updatedMessages = [...best];
          const deletedIndex = updatedMessages.findIndex(
            (msg) => msg._id === messageId
          );

          if (deletedIndex !== -1) {
            updatedMessages[deletedIndex].isDeleted = true;
            // Update the state
            setBest(updatedMessages); // Replace with your actual state setter
            if (best) {
              // setflet(false)
            }
          }
        }
      })
      .catch((error) => {
        console.error("Error deleting message:", error);
      });
  };

  function goback() {
    navigate("/dashboard/Home");
  }
  const draw = () => {
    setfemo(true);
    setfirs(false);
  };

  const handleClick = (id, i) => {
    // alert(`button clicked with ${id}`);
    if (!hideEdit) {
      sethideEdit(true);
    } else {
      sethideEdit(false);
    }
    setReceivedId(id);
  };
     
  const chatContainerRef = useRef(null);

  useLayoutEffect(() => {
    // Scroll to the bottom when the component mounts or when 'best' updates
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [best]);



  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setflet(true)
  };

  const onData = (recordedBlob) => {
    // Handle the audio data here
    console.log('chunk of real-time data is: ', recordedBlob);
  };

  const onStop = (recordedBlob) => {
    // Handle the final audio data here
    console.log('recordedBlob is: ', recordedBlob);
    setAudioBlob(recordedBlob.blob);
  };


const sendVoiceNote = async () => {
  // setflet(false)
  try {
    if (!audioBlob) {
      console.error('No recorded audio to send');
      alert('No recorded audio to send')
      return;
    }

    // Convert audioBlob to a base64 string
    const base64Audio = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(new Blob([audioBlob]));
    });

    // Include audio data and additional information in the request body
    const requestData = {
      receiverId:"", 
      senderId :"", 
      content: 'Voice Note',
      audio: base64Audio,
      messageType: 'audio',
    };
   console.log(requestData);
    // Make a POST request to your backend
    const response = await axios.post("https://lnbackend.onrender.com/users/uploadvoice", {requestData});

    console.log(response.data); // Assuming your backend sends some data upon successful upload
    console.log('Voice note sent successfully');

    // Reset recording state or perform any other actions as needed
    setIsRecording(false);
    setAudioBlob(null);
  } catch (error) {
    console.error('Error sending voice note:', error);
    // Handle the error appropriately
  }
};

const [audioPlayer, setAudioPlayer] = useState(null);
// const [audioPlayer, setAudioPlayer] = useState(null);

  const playVoiceNote = (audioUrl) => {
    // Create an audio element dynamically
    const audio = new Audio(audioUrl);

    // Set up event listener for when the audio ends
    audio.addEventListener('ended', () => {
      // You may add additional logic here if needed
    });

    // Set the audio element to the state
    setAudioPlayer(audio);

    // Play the audio
    audio.play();
  };

  const pauseVoiceNote = () => {
    // Pause the audio if the audioPlayer is defined
    if (audioPlayer) {
      audioPlayer.pause();
    }
  };

  


  const capitalizeFirstLetter = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };
  return (
    <>
      <main className="container-fluid   row fele ">
        <section className="d-none d-md-block w-100">
          x
          <div className="  fem">
            <button className="btn btn-dark " onClick={goback}>
              <RiArrowGoBackLine /> Go Back
            </button>
          </div>
          <main className="d-flex">
            <div className=" col-4 faap bg-light text-dark ">
              <div className="">
                <h2 className="flmk">
                  <IoChatbubblesOutline /> Chats
                </h2>
              </div>
              {showAllFriend &&
                showAllFriend.map((el, i) => (
                  <div className=" bg-danger" key={i}>
                    <div
                      onClick={() => pressme(el, i)}
                      className="d-flex bg-white text-dark align-items-center rounded  border my-1 p-1"
                    >
                      <img
                        src={el.profilePic}
                        className="bluh"
                        alt=""
                        srcset=""
                      />
                      <p className="mx-2 mt-3">
                        {capitalizeFirstLetter(el.username)}{" "}
                      </p>
                    </div>
                  </div>
                ))}
            </div>

            <div className="col-8 d-none bg-danger d-md-block beni p-2 position-relative">
              {firs && (
                <main>
                  <div>
                    <div className="d-flex align-items-center justify-content-between   p-2 bg-light rounded">
                      <main className="d-flex align-items-center">
                        <img
                          src={display.profilePic}
                          className="bluh mx-2"
                          alt=""
                          srcset=""
                        />
                        <h3>{display.username}</h3>
                      </main>
                      <main>
                        <button  className=" ">
                          {/* onClick={handleVoiceCall} disabled={activeCall} */}
                          <BiSolidPhoneCall  className="fs-1 border border-2  p-1 rounded rounded-circle border-success text=light" />
                        </button>
                      </main>
                    </div>
                  </div>
                  <hr />

                  <div className="go "  ref={chatContainerRef} >
                  {best &&
                  best.map((el, i) =>
                    el.sender === display._id ? (
                      <div className=" vvo rounded rounded-3 my-1" key={i}>
                        <div className="solo bg-success rounded rounded-2 text-light p-2">
                          {editing.isEditing && editing.messageId === el._id ? (
                            <>
                              <input
                                type="text"
                                value={editedMessage}
                                onChange={(e) =>
                                  setEditedMessage(e.target.value)
                                }
                                className="form-control"
                              />
                              <button
                                className="btn btn-primary"
                                onClick={() => handleEdit(el, i)}
                              >
                                Save Edit
                              </button>
                              <button
                                className="btn btn-light"
                                onClick={() => toggleEditing(null)}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <p className="p-2 my-1 rounded rounded-2">
                                {el.isDeleted ? " Message deleted" : el.content}
                              </p>
                              <p className="timeb">
                                {new Date(el.timestamp).toLocaleTimeString(
                                  "en-US",
                                  {
                                    hour: "numeric",
                                    minute: "numeric",
                                  }
                                )}
                              </p>

                              {!el.isDeleted && (
                                <p
                                  className="gener"
                                  onClick={() => handleClick(el._id, i)}
                                >
                                  <CiMenuKebab className="border p-1 border-1 rounded rounded-circle" />
                                </p>
                              )}
                              {hideEdit && receivedId === el._id ? (
                                <main>
                                  <div>
                                    <button
                                      class="edit-button"
                                      onClick={() => toggleEditing(el._id)}
                                    >
                                      <svg
                                        class="edit-svgIcon"
                                        viewBox="0 0 512 512"
                                      >
                                        <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                                      </svg>
                                    </button>
                                  </div>

                                  <button
                                    onClick={() => handleDelMessage(el._id)}
                                    class="bin-button"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 39 7"
                                      class="bin-top"
                                    >
                                      <line
                                        stroke-width="4"
                                        stroke="white"
                                        y2="5"
                                        x2="39"
                                        y1="5"
                                      ></line>
                                      <line
                                        stroke-width="3"
                                        stroke="white"
                                        y2="1.5"
                                        x2="26.0357"
                                        y1="1.5"
                                        x1="12"
                                      ></line>
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 33 39"
                                      class="bin-bottom"
                                    >
                                      <mask
                                        fill="white"
                                        id="path-1-inside-1_8_19"
                                      >
                                        <path d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"></path>
                                      </mask>
                                      <path
                                        mask="url(#path-1-inside-1_8_19)"
                                        fill="white"
                                        d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
                                      ></path>
                                      <path
                                        stroke-width="4"
                                        stroke="white"
                                        d="M12 6L12 29"
                                      ></path>
                                      <path
                                        stroke-width="4"
                                        stroke="white"
                                        d="M21 6V29"
                                      ></path>
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 89 80"
                                      class="garbage"
                                    >
                                      <path
                                        fill="white"
                                        d="M20.5 10.5L37.5 15.5L42.5 11.5L51.5 12.5L68.75 0L72 11.5L79.5 12.5H88.5L87 22L68.75 31.5L75.5066 25L86 26L87 35.5L77.5 48L70.5 49.5L80 50L77.5 71.5L63.5 58.5L53.5 68.5L65.5 70.5L45.5 73L35.5 79.5L28 67L16 63L12 51.5L0 48L16 25L22.5 17L20.5 10.5Z"
                                      ></path>
                                    </svg>
                                  </button>
                                </main>
                              ) : null}
                            </>
                          )}
                           {el.type === 'audio' && (
              <div className="voice-note-controls">
                <button
                  className="btn btn-primary"
                  onClick={() => playVoiceNote(el.audioUrl)}
                >
                  <CiPlay1 />
                </button>
                <button
                  className="btn btn-light"
                  onClick={pauseVoiceNote}
                >
                <CiPause1 />
                </button>
                
              </div>
            )}
                        </div>
                      </div>
                    ) : (
                      <div
                        className="vento rounded rounded-3  my-1 bg-primary-subtle "
                        key={i}
                      >
                          <p className="p-2 my-1 rounded rounded-2">
                                {el.isDeleted ? " Message deleted" : el.content}
                              </p>
                              <p className="timeb">
                                {new Date(el.timestamp).toLocaleTimeString(
                                  "en-US",
                                  {
                                    hour: "numeric",
                                    minute: "numeric",
                                  }
                                )}
                              </p>
                      </div>
                    )
                  )}
                    
                  </div>

                  <div className="d-flex align-items-center position-absolute bottom-0 end-0 start-0 bg-white ">
                    <p className="mt-1 ms-1">
                      <ImFilePicture />
                    </p>
                    {isRecording ? (
                     <ReactMic
                           record={isRecording}
                           className="sound-wave"
                           onStop={onStop}
                           onData={onData}
                           strokeColor="#000000"
                           backgroundColor="#FF4081"
                         />
                    ) :(
                    <input
                    id="chatInput"
                      type="text"
                      value={inputtext}
                      placeholder="Type a text"
                      className="form-control mx-2"v 
                      onChange={(e) => {
                        setinputtext(e.target.value);
                      }}
                    />)}
                    <div>
                    {
                      inputtext !== "" ?(<button className="btn btn-primary  " onClick={sendText}>
                      Send
                    </button>) :
                    ( <div>
                     
                     {isRecording ? (
                       <button className="btn btn-danger text-light" onClick={stopRecording}>
                        <IoStopCircleOutline />
                       </button>
                     ) : (
                       <button className="btn btn-primary" onClick={startRecording}>
                         <MdOutlineKeyboardVoice />
                       </button>
                     )}
                    {flet && <button className="btn btn-primary" onClick={sendVoiceNote}>
                       Send VN
                     </button>}
                   </div>)

                    }     
                    
                    </div>
                    
                  </div>
                </main>
              )}
              {second && (
                <div className="text-center text-light mx-auto mt-5">
                  <p>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Quis sed, non perspiciatis omnis, dolore ut illum
                    repudiandae, quisquam error quidem necessitatibus
                    reprehenderit ipsum quam enim asperiores illo! Harum, illo
                    doloribus.
                  </p>
                </div>
              )}
            </div>
          </main>
        </section>

        <section className="d-block d-md-none">
          <div className="  fem">
            <button className="btn btn-dark " onClick={goback}>
              <RiArrowGoBackLine /> Go Back
            </button>
          </div>
          <div>
            {femo && (
              <div className=" col-md-4 faap bg-light text-dark ">
                <div className="">
                  <h2 className="flmk">
                    <IoChatbubblesOutline /> Chats
                  </h2>
                </div>
                {showAllFriend &&
                  showAllFriend.map((el, i) => (
                    <div className=" bg-danger" key={i}>
                      <div
                        onClick={() => pressme(el, i)}
                        className="d-flex bg-white text-dark align-items-center rounded  border my-1 p-1"
                      >
                        <img
                          src={el.profilePic}
                          className="bluh"
                          alt=""
                          srcset=""
                        />
                        <p className="mx-2 mt-3">
                          {capitalizeFirstLetter(el.username)}{" "}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {firs && (
            <main className="col-12 ">
              <div className="d-flex align-align-items-center bg-light justify-content-between">
                <div className="d-flex align-items-center ksk  ">
                  <img
                    src={display.profilePic}
                    className="bluh mx-2"
                    alt=""
                    srcset=""
                  />
                  <h3>{display.username}</h3>
                </div>
                <hr />
                <div className="d-flex align-items-center p-1">
                  <main className="me-3">
                    <button className=" ">
                      {/* onClick={handleVoiceCall} disabled={activeCall} */}
                      <BiSolidPhoneCall className="fs-1 border border-2  p-1 rounded rounded-circle border-success text=light" />
                    </button>
                  </main>
                  <main>
                    <button onClick={draw} className="btn btn-dark">
                      x
                    </button>
                  </main>
                </div>
              </div>

              <div className="go "  ref={chatContainerRef} >
                  {best &&
                  best.map((el, i) =>
                    el.sender === display._id ? (
                      <div className=" vvo rounded rounded-3 my-1" key={i}>
                        <div className="solo bg-success rounded rounded-2 text-light p-2">
                          {editing.isEditing && editing.messageId === el._id ? (
                            <>
                              <input
                                type="text"
                                value={editedMessage}
                                onChange={(e) =>
                                  setEditedMessage(e.target.value)
                                }
                                className="form-control"
                              />
                              <button
                                className="btn btn-primary"
                                onClick={() => handleEdit(el, i)}
                              >
                                Save Edit
                              </button>
                              <button
                                className="btn btn-light"
                                onClick={() => toggleEditing(null)}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <p className="p-2 my-1 rounded rounded-2">
                                {el.isDeleted ? " Message deleted" : el.content}
                              </p>
                              <p className="timeb">
                                {new Date(el.timestamp).toLocaleTimeString(
                                  "en-US",
                                  {
                                    hour: "numeric",
                                    minute: "numeric",
                                  }
                                )}
                              </p>

                              {!el.isDeleted && (
                                <p
                                  className="gener"
                                  onClick={() => handleClick(el._id, i)}
                                >
                                  <CiMenuKebab className="border p-1 border-1 rounded rounded-circle" />
                                </p>
                              )}
                              {hideEdit && receivedId === el._id ? (
                                <main>
                                  <div>
                                    <button
                                      class="edit-button"
                                      onClick={() => toggleEditing(el._id)}
                                    >
                                      <svg
                                        class="edit-svgIcon"
                                        viewBox="0 0 512 512"
                                      >
                                        <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                                      </svg>
                                    </button>
                                  </div>

                                  <button
                                    onClick={() => handleDelMessage(el._id)}
                                    class="bin-button"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 39 7"
                                      class="bin-top"
                                    >
                                      <line
                                        stroke-width="4"
                                        stroke="white"
                                        y2="5"
                                        x2="39"
                                        y1="5"
                                      ></line>
                                      <line
                                        stroke-width="3"
                                        stroke="white"
                                        y2="1.5"
                                        x2="26.0357"
                                        y1="1.5"
                                        x1="12"
                                      ></line>
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 33 39"
                                      class="bin-bottom"
                                    >
                                      <mask
                                        fill="white"
                                        id="path-1-inside-1_8_19"
                                      >
                                        <path d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"></path>
                                      </mask>
                                      <path
                                        mask="url(#path-1-inside-1_8_19)"
                                        fill="white"
                                        d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
                                      ></path>
                                      <path
                                        stroke-width="4"
                                        stroke="white"
                                        d="M12 6L12 29"
                                      ></path>
                                      <path
                                        stroke-width="4"
                                        stroke="white"
                                        d="M21 6V29"
                                      ></path>
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 89 80"
                                      class="garbage"
                                    >
                                      <path
                                        fill="white"
                                        d="M20.5 10.5L37.5 15.5L42.5 11.5L51.5 12.5L68.75 0L72 11.5L79.5 12.5H88.5L87 22L68.75 31.5L75.5066 25L86 26L87 35.5L77.5 48L70.5 49.5L80 50L77.5 71.5L63.5 58.5L53.5 68.5L65.5 70.5L45.5 73L35.5 79.5L28 67L16 63L12 51.5L0 48L16 25L22.5 17L20.5 10.5Z"
                                      ></path>
                                    </svg>
                                  </button>
                                </main>
                              ) : null}
                            </>
                          )}
                           {el.type === 'audio' && (
              <div className="voice-note-controls">
                <button
                  className="btn btn-primary"
                  onClick={() => playVoiceNote(el.audioUrl)}
                >
                  <CiPlay1 />
                </button>
                <button
                  className="btn btn-light"
                  onClick={pauseVoiceNote}
                >
                <CiPause1 />
                </button>
                
              </div>
            )}
                        </div>
                      </div>
                    ) : (
                      <div
                        className="vento rounded rounded-3  my-1 bg-primary-subtle "
                        key={i}
                      >
                          <p className="p-2 my-1 rounded rounded-2">
                                {el.isDeleted ? " Message deleted" : el.content}
                              </p>
                              <p className="timeb">
                                {new Date(el.timestamp).toLocaleTimeString(
                                  "en-US",
                                  {
                                    hour: "numeric",
                                    minute: "numeric",
                                  }
                                )}
                              </p>
                      </div>
                    )
                  )}
                    
                  </div>

                  <div className="d-flex align-items-center position-absolute bottom-0 end-0 start-0 bg-white ">
                    <p className="mt-1 ms-1">
                      <ImFilePicture />
                    </p>
                    {isRecording ? (
                    <ReactMic
                          record={isRecording}
                          className="sound-wave"
                          onStop={onStop}
                          onData={onData}
                          strokeColor="#000000"
                          backgroundColor="#FF4081"
                        />
                    ) :(
                    <input
                    id="chatInput"
                      type="text"
                      value={inputtext}
                      placeholder="Type a text"
                      className="form-control mx-2"
                      onChange={(e) => {
                        setinputtext(e.target.value);
                      }}
                    />)}
                    <div>
                    {
                      inputtext !== "" ?(<button className="btn btn-primary  " onClick={sendText}>
                      Send
                    </button>) :
                    ( <div>
                     
                     {isRecording ? (
                       <button className="btn btn-danger text-light" onClick={stopRecording}>
                        <IoStopCircleOutline />
                       </button>
                     ) : (
                       <button className="btn btn-primary" onClick={startRecording}>
                         <MdOutlineKeyboardVoice />
                       </button>
                     )}
                     {flet && <button className="btn btn-primary" onClick={sendVoiceNote}>
                       Send Voice Note
                     </button>}
                   </div>)

                    }     
                    
                    </div>
                    
                  </div>
            </main>
          )}
        </section>
      </main>
    </>
  );
};

export default Chat;
