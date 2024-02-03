import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  isfetchingFriend,
  fetchedAllFriends,
  fetchingError,
} from "../Redux/FriendSlice";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoSend } from "react-icons/io5";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { VscDebugDisconnect } from "react-icons/vsc";
import { FaPeoplePulling } from "react-icons/fa6";
import { IoChatbubblesOutline } from "react-icons/io5";
// import io from "socket.io-client";

const NetworkPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isfetching, allFriend, isfetchingError } = useSelector(
    (state) => state.FriendSlice
  );
  // console.log(allFriend);

  const { id } = useParams();
  // console.log(id)
  const { added, addingError, isAdding } = useSelector(
    (state) => state.findUser
  );
  const oneuser = added.find((el) => el.email === id);

  const [friendData, setFriendData] = useState();
  const [friendshipStatus, setFriendshipStatus] = useState(false);
  const [friendId, setfriendID] = useState("");
  const [disInfo, setdisInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [showFriends, setshowFriends] = useState([]);
  const [chat, setchat] = useState("");
  const [frienddetails, setfrienddetails] = useState("");
  const [messages, setMessages] = useState([]);
  const [best, setBest] = useState([]);
  const [hide, sethide] = useState(false)
  useEffect(() => {
    if (oneuser) {
      setFriendData(oneuser);

      setfriendID(oneuser);
    }
  }, [oneuser]);

  // console.log(friendDetails)
  // console.log(friendId)
  const token = localStorage.getItem("Ln Token");

  useEffect(() => {
    axios
      .get("http://localhost:4345/users/verify", {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data.user);
        setdisInfo(res.data.user);
        console.log(disInfo);

        // setmessage(res.data.user)
        // console.log(res.data.user)
      })
      .catch((error) => {
        if (
          error.response.data.message ===
          "Operation `signups.findOne()` buffering timed out after 10000ms"
        ) {
          toast(error.response.statusText);
        } else {
          console.log(error);
          toast(error.response.data.message);
          navigate("/sign");
        }
      });
  }, []);

  function getallFriends() {
    const identity = disInfo._id;
    console.log(identity);

    axios
      .post("http://localhost:4345/users/fetch", { identity })
      .then((res) => {
        // console.log(res);
        setshowFriends(res.data.arr);
        dispatch(fetchedAllFriends(res.data.arr));
      })
      .catch((error) => {
        console.log(error);
        dispatch(fetchingError(error));
      });
  }
  // console.log(fetchedAllFriends);

  useEffect(() => {
    getallFriends();
  }, [disInfo._id]); // Add disInfo._id as a dependency

  useEffect(() => {
    // Load friend status from localStorage on component mount
    const storedFriendshipStatus = localStorage.getItem(
      `friendshipStatus-${disInfo._id}-${friendId}`
    );
    if (storedFriendshipStatus !== null) {
      setFriendshipStatus(JSON.parse(storedFriendshipStatus));
    }

    // Set loading state to false
    setIsLoading(false);

    // Other initialization code...
  }, [disInfo._id, friendId]);

  useEffect(() => {
    // Save friend status to localStorage whenever it changes
    if (!isLoading) {
      localStorage.setItem(
        `friendshipStatus-${disInfo._id}-${friendId}`,
        JSON.stringify(friendshipStatus)
      );
    }
  }, [friendshipStatus, disInfo._id, friendId, isLoading]);

  const addFriend = async () => {
    console.log(friendId);
    const value = {
      userEmail: disInfo.email,
      action: friendshipStatus ? "remove" : "add",
      friendEmail: friendId.email,
    };
    console.log(value);
    axios
      .post("http://localhost:4345/users/addnewfriend", { value })
      .then((res) => {
        console.log(res);
        console.log(res.data.message);
        toast(res.data.message);
        setFriendshipStatus(!friendshipStatus);
      })
      .catch((error) => {
        console.log(error);
        toast(error.response.data.error);
      });
  };

  useEffect(() => {
    const getmessages = async () => {
      try {
        const userId = await disInfo._id;
        const friendID = await friendId._id;
         await axios.get(`http://localhost:4345/users/getChatMessages/${userId}/${friendID}`)
         .then((res)=>{
          setBest(res.data.messages)
         }).catch((error)=>{
          console.log(error)
         })
        
        // Update your state or do something with the fetched data
      } catch (error) {
        console.log(error);

    };
  }
  
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
  }, [disInfo._id, friendId._id]); // Add dependencies that should trigger a re-fetch
  


  const chatroom = async () => {
    sethide(true)
    // try {
    //   const userId = disInfo._id;
    //   const friendID = friendId._id;
    //   console.log(userId, friendID);

    //   await axios
    //     .get(
    //       `http://localhost:4345/users/getChatMessages/${userId}/${friendID}`
    //     )
    //     .then((res) => {
    //       console.log(res);
        
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // } catch (error) {
    //   console.error("Error fetching chat messages", error);
    // }
  };


  useEffect(() => {
   const chatInput = document.getElementById("chatInput")
    if (chatInput) {
      chatInput.value = chat;
    }
  }, [chat]);


  const sendText = () => {
    const value = {
      receiverId: disInfo._id,
      senderId: friendId._id,
      content: chat,
      messageType: "",
    };
    console.log(value);
    // socket.emit("message", value);
    axios
      .post("http://localhost:4345/users/BestPost", { value })
      .then((res) => {
        console.log(res);
        setchat("")
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const [editing, setEditing] = useState({ isEditing: false, messageId: null });
  const [editedMessage, setEditedMessage] = useState('');

  const toggleEditing = (messageId) => {
    setEditing({ isEditing: !editing.isEditing, messageId });
    setEditedMessage(''); // Clear edited message when toggling editing mode
  };


  const handleEdit = async (el, i) => {
      
    // Implement the logic to send a POST request to update the chat message
    const updatedMessage = {
      messageId: el._id,
      content: editedMessage,
    };
     console.log(updatedMessage);
    // Modify the endpoint to your actual server endpoint for updating messages
     await axios.post("http://localhost:4345/users/updateChatMessage",{updatedMessage})
      .then((response)=>{
        console.log(response.data);
        
        
        
        // Assuming the server successfully updates the message, update the state accordingly
        const updatedBest = [...best];
        updatedBest[i].content = editedMessage;
        setBest(updatedBest);
        
        // Toggle off editing mode
        toggleEditing(null);
      }).catch((error)=> {
    console.error("Error updating message:", error);
    // You may want to handle errors or provide user feedback here
  })
};

  function goback() {
    navigate("/dashboard/Home");
  }
  const closeit = ()=>{
    sethide(false)
  }
  const capitalizeFirstLetter = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  return (
    <>
      <section className="container-fluid  blink">
        <main>
          <div>
            {/* <button className='btn btn-dark rounded-3 ' ><FaLongArrowAltLeft /></button> */}
            <button onClick={goback} className="Btn">
              <FaLongArrowAltLeft />
            </button>
          </div>
          {friendData && (
            <div className="col-md-6  col-sm-10  mx-auto p-2 my-1 rounded-2 border bent d-flex justify-content-center align-items-center flex-column">
              <section className="d-flex align-items-center justify-content-between w-100 my-4">
                <main>
                  <button onClick={addFriend} className="stem ">
                    {friendshipStatus ? (
                      <p>
                        <VscDebugDisconnect /> disconnect
                      </p>
                    ) : (
                      <p>
                        <FaPeoplePulling /> Connect
                      </p>
                    )}
                  </button>
                </main>
                <div className="d-flex justify-content-center">
                  {/* <img  src={frienddetails.profilePic} className='bluh mx-2' alt="" srcset="" /> */}
                  <img
                    src={friendData.profilePic}
                    alt=""
                    className="img-fluid vlop "
                  />
                </div>
                <main>
                  <div className="d-flex ">
                      <button className="stem" onClick={chatroom}>
                        <IoChatbubblesOutline /> Message
                      </button>
                     </div>
                      
                    
                  {/* </div> */}
                </main>
              </section>

              <div className="m-auto kolt">
                <center className="h4 me-2">
                  {capitalizeFirstLetter(friendData.username)}
                </center>
                <p>{capitalizeFirstLetter(friendData.email)}</p>
                <center>web Producer-web Specialist</center>
                <center>Columbia University-New York</center>

                <center className="text-light  bg-dark py-2 rounded my-2">
                  {friendData.friends.length}{" "}
                  {friendData.friends.length < 2 ? "Friend" : "Friends"}
                </center>
              </div>
            </div>
          )}
        </main>
        <section className="mt-5 fens">
          <center className="border-bottom fw-bold h3 border-dark border-2">
            Your Companion Crew
          </center>
          <p>Friends List</p>
          {showFriends &&
            showFriends.map((el, i) => (
              <div className="d-flex align-items-center  text-dark  my-1">
                <img src={el.profilePic} className="bluh" srcset="" />
                <p className="mx-2 mt-2">{el.email}</p>
              </div>
            ))}
        </section>
        <main className="container col-8 col-md-4 bg-light femo">
                        {hide && <section className="  rounded-2 p-2">
                          <div className="d-flex align-items-center justify-content-between ">
                            <div className="d-flex align-items-center  ">

                            <img
                              src={friendId.profilePic}
                              className="bluh"
                              alt=""
                              srcset=""
                              />
                            <h3 className="px-2">{friendId && friendId.username}</h3>
                          </div>
                             <div>
                              <button onClick={closeit} className="btn btn-close "></button>
                             </div>
                              </div>
                          <hr />
                          <div className="golf">
                          {best &&
  best.map((el, i) =>
    el.sender == disInfo._id ? (
      <div className="bg-info vvo rounded rounded-3 my-1" key={i}>
        {editing.isEditing && editing.messageId === el._id ? (
          <>
            <input
              type="text"
              value={editedMessage} // Add this line to set the initial value
              onChange={(e) => setEditedMessage(e.target.value)}
              className="form-control"
            />
            <button className='btn btn-primary' onClick={() => handleEdit(el, i)}>
              Save Edit
            </button>
            <button  className='btn btn-light'  onClick={() => toggleEditing(null)}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <p className="p-1  my-1">{el.content}</p>
            <p className="timer">{new Date(el.timestamp).toLocaleTimeString('en-US', { hour: "numeric", minute: 'numeric' })}</p>
            <button class="edit-button"  onClick={() => toggleEditing(el._id)} >
  <svg class="edit-svgIcon" viewBox="0 0 512 512">
                    <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                  </svg>
</button>
          </>
        )}
      </div>
    ) : (
      <div className="vento rounded rounded-3 bg-primary-subtle my-1" key={i}>
        {editing.isEditing && editing.messageId === el._id ? (
          <>
            <input
              type="text"
              value={editedMessage} // Add this line to set the initial value
              onChange={(e) => setEditedMessage(e.target.value)}
              className="form-control"
            />
            <button className='btn btn-primary' onClick={() => handleEdit(el, i)}>
              Save Edit
            </button>
            <button className='btn btn-light' onClick={() => toggleEditing(null)}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <p className="p-1 my-1">{el.content}</p>
            <p className="timeb">{new Date(el.timestamp).toLocaleTimeString('en-US', { hour: "numeric", minute: 'numeric' })}</p>
          </>
        )}
      </div>
    )
  )
}
                          </div>
                          

                          <div className="d-flex  align-items-center mt-3">
                            <input
                              type="text"
                              placeholder="Input your Text here"
                              className=" form-control "
                              onChange={(e) => {
                                setchat(e.target.value);
                              }}
                              id="chatInput"
                            />
                            <button
                              onClick={sendText}
                              className="btn btn-primary mx-2 fs-6"
                            >
                              <IoSend />
                            </button>
                          </div>
                        </section>}
                      </main> 
      </section>
      <ToastContainer />
    </>
  );
};

export default NetworkPage;
