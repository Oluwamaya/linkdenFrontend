import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { isfetchingFriend, fetchedAllFriends, fetchingError} from '../Redux/FriendSlice'
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoSend } from "react-icons/io5";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { VscDebugDisconnect } from "react-icons/vsc";
import { FaPeoplePulling } from "react-icons/fa6";
import { IoChatbubblesOutline } from "react-icons/io5";



const NetworkPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {isfetching, allFriend, isfetchingError} = useSelector((state)=> state.FriendSlice)
  console.log(allFriend);

  const {id} =useParams()
  // console.log(id)
  const {added, addingError,isAdding} = useSelector((state)=>state.findUser)
  const oneuser = added.find((el)=>el.email === id)
  
  
  const [friendData, setFriendData] = useState();
  const [friendshipStatus, setFriendshipStatus] = useState(false);
  const [friendId, setfriendID] = useState("")
  const [disInfo, setdisInfo] = useState({})
  const [isLoading, setIsLoading] = useState(true);
  const [showFriends, setshowFriends] = useState([])
  const [chat, setchat] = useState("")
  const [frienddetails, setfrienddetails] = useState('')
  const [messaging, setmessaging] = useState()
 


  useEffect(() => {
   
    if (oneuser) {
    setFriendData(oneuser)
      
    setfriendID(oneuser)
    }
    
  }, [oneuser])
  
  // console.log(friendDetails)
  // console.log(friendId)
  const token = localStorage.getItem("Ln Token");

  
  useEffect(() => {
    axios.get("http://localhost:4345/users/verify",{
      headers:{
        Authorization: `bearer ${token}`
      }
    }).then((res)=>{
        console.log(res.data.user)
        setdisInfo(res.data.user)
        console.log(disInfo);
        
        // setmessage(res.data.user)
        // console.log(res.data.user)
      })
      .catch((error)=>{
        if (error.response.data.message === 'Operation `signups.findOne()` buffering timed out after 10000ms') {
          toast(error.response.statusText)
        }else{
        console.log(error);
        toast(error.response.data.message)
        navigate("/sign")
        }
        
      })
      
    }, [])
     
    
    
    function getallFriends() {
      const identity = disInfo._id;
      console.log(identity);
    
      axios.post("http://localhost:4345/users/fetch", { identity })
        .then((res) => {
          console.log(res);
        setshowFriends(res.data.arr) 
        dispatch(fetchedAllFriends(res.data.arr))
      })
      .catch((error) => {
          console.log(error);
          dispatch(fetchingError(error))
        });
      }
      // console.log(fetchedAllFriends);
    
    useEffect(() => {
      getallFriends();
    }, [disInfo._id]); // Add disInfo._id as a dependency
    
      


   
    useEffect(() => {
      // Load friend status from localStorage on component mount
      const storedFriendshipStatus = localStorage.getItem(`friendshipStatus-${disInfo._id}-${friendId}`);
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
        localStorage.setItem(`friendshipStatus-${disInfo._id}-${friendId}`, JSON.stringify(friendshipStatus));
      }
    }, [friendshipStatus, disInfo._id, friendId, isLoading]);
  

  const addFriend = async () => {
    console.log(friendId);
   const value ={
    userEmail: disInfo.email,
    action: friendshipStatus ? 'remove' : 'add',
    friendEmail : friendId.email, 
  }
  console.log(value)
  axios.post("http://localhost:4345/users/addnewfriend", {value})
  .then((res)=>{
    console.log(res) 
    console.log(res.data.message)
    toast(res.data.message) 
      setFriendshipStatus(!friendshipStatus)
    }).catch((error)=>{
        console.log(error)
        toast(error.response.data.error)
    })
  };

  function chatroom() {
    const friendInfo = friendId._id
    console.log(friendInfo);
     
    axios.post("http://localhost:4345/users/fetch", {friendInfo}).then((res)=>{
      console.log(res.data.friendDetails);
      setfrienddetails(res.data.friendDetails)
      console.log(frienddetails);
    }).catch((error)=>{
      console.log(error);
    })
     
  }
  const userId = disInfo._id
  // useEffect(() => {
  //   const getMessages = async () => {   
  //       const friendid = friendId._id
  //       console.log(friendid , userId);
  //       // Use friendId directly from the component props
  //       await axios.get(`http://localhost:4345/users/showmessage/${userId}/${friendid}`
  //       ).then((res)=>{
  //         console.log(res);
  //       setmessaging(res.data.messages);
  //       }).catch((error)=>{
  //       console.log(error);
  //     })
  //   }
  //   // Call the function to fetch messages
  //   getMessages();
  // }, [userId, friendId]); 
  
  
  
  const sendText =()=>{
    const value = {
      userId: disInfo._id,
      friendId : friendId._id,
      message : chat
    }
    console.log(value);
    axios.post("http://localhost:4345/users/message", {value
  }).then((res)=>{
      console.log(res);
    }).catch((error)=>{
      console.log(error);
    })
     
    
  }


function goback() {
  navigate("/dashboard/Home")
}

  const capitalizeFirstLetter = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  ;

  return (
    <>
    <section className='container-fluid  blink'>
      
    <main >
      <div>
        {/* <button className='btn btn-dark rounded-3 ' ><FaLongArrowAltLeft /></button> */}
        <button onClick={goback} className="Btn">
        <FaLongArrowAltLeft />
<p className="text">Back</p>
</button>

      </div>
      {friendData && (
        <div className='col-md-6  col-sm-10  mx-auto p-2 my-1 rounded-2 border bent d-flex justify-content-center align-items-center flex-column'>
            <section className='d-flex align-items-center justify-content-between w-100 my-4'>
              <main>
              <button onClick={addFriend} className='stem '>
              {friendshipStatus ?(<p><VscDebugDisconnect /> disconnect</p>): ( <p><FaPeoplePulling /> Connect</p> ) }
            </button>
              </main>
              <div className='d-flex justify-content-center'>
              {/* <img  src={frienddetails.profilePic} className='bluh mx-2' alt="" srcset="" /> */}
              <img src={friendData.profilePic} alt='' className='img-fluid vlop ' />
              </div>
              <main>
              <div className='d-flex '>
           
            <div className='anim'> 

            <button className='stem' onClick={chatroom}><IoChatbubblesOutline /> Message</button>

            <main className="container col-6">
       <section className='mko  rounded-2 p-2'>
        <div className='d-flex align-items-center '>
         
          <h3>{frienddetails.username}</h3>
        </div>
        <div className>
       <p className='blood border rounded-2 bg-dark text-light'>{}just me and you</p>   
        <p className=' flem'> send it to me </p>
        </div>
        
        <div className='d-flex  align-items-center mt-3'>
          <input type="text" placeholder='Input your Text here' className=' form-control ' onChange={(e)=>{setchat(e.target.value)}} id="" />
          <button onClick={sendText} className='btn btn-primary mx-2 fs-6'><IoSend /></button>
        </div>
       </section>
       </main>
            </div>
          </div>
              </main>
              </section>        
          
          <div className='m-auto kolt'>
            <center className='h4 me-2'>{capitalizeFirstLetter(friendData.username)}</center>
          <p>{capitalizeFirstLetter(friendData.email)}</p>
            <center>web Producer-web Specialist</center>
            <center>Columbia University-New York</center>
           
          <center className="text-light  bg-dark py-2 rounded my-2">{showFriends.length}  {showFriends.length < 2 ? "Friend": "Friends"}</center>
          </div>
          
        </div>
      )}
    </main>
      <section className="mt-5 fens">
         <center className="border-bottom fw-bold h3 border-dark border-2">Your Companion Crew</center>
         <p >Friends List</p>
          {showFriends&&
           
           showFriends.map((el, i)=>(
            <div className='d-flex align-items-center bg-dark text-light'>
               <img src={el.profilePic} className='bluh' srcset="" />
               <p className='mx-2'>{el.email}</p>
            </div>
           ))
          }
      </section>
      
    </section>
     <ToastContainer />
    </>
  );
};


export default NetworkPage;
