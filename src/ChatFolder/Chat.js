import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { ImFilePicture } from "react-icons/im";
import { useDispatch, useSelector } from 'react-redux';
import { RiArrowGoBackLine } from "react-icons/ri";
import { IoChatbubblesOutline } from "react-icons/io5";


const Chat = () => {
  const [showAllFriend, setshowAllFriend] = useState([])
  const [display, setdisplay] = useState({});
  const [best, setBest] = useState()
  const [femo, setfemo] = useState(true)

  const {isfetching, allFriend, isfetchingError} = useSelector((state)=> state.FriendSlice)
  console.log(allFriend);
  console.log(showAllFriend);  
  useEffect(() => {
    setshowAllFriend(allFriend);
  }, []); // Empty dependency array to run the effect only once on mount
  
  // Rest of your component code
  
 
  const dispatch = useDispatch()
    const navigate = useNavigate()
    const token = localStorage.getItem("Ln Token");
    const [first, setfirst] = useState({})
    const [inputtext, setinputtext] = useState("")
    const [firs, setfirs] = useState(false)
    const [second, setsecond] = useState(true)
    useEffect(() => {
        axios.get("http://localhost:4345/users/verify",{
          headers:{
            Authorization: `bearer ${token}`
          }
        }).then((res)=>{
            console.log(res.data.user)
            setfirst(res.data.user)
          })
          .catch((error)=>{
            console.log(error);
            alert(error.response.data.message)
            navigate("/sign")
            
            
          })
          
        }, [])

     const pressme =(el,i)=>{
      setsecond(false)
      setfirs(true)
      setfemo(false)
      setdisplay(el)
     }
     console.log(display);
      useEffect(() => {
        const getmessages = async () => {
          try {
            
            const userId = await first._id;
            const friendID = await display._id;
            console.log(friendID)
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
      }, [first._id, display._id]); 
      
     
      useEffect(() => {
        const chatInput = document.getElementById("chatInput")
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
          setinputtext("")
        })
        .catch((error) => {
          console.log(error);
        });
    };
     function goback(){
      navigate("/dashboard/Home")
    }
    const draw = ()=>{
      setfemo(true)
      setfirs(false)
    }
     
     const capitalizeFirstLetter = (word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    };
  return (
    <>
       <main className='container-fluid   row fele '> 
       <section className='d-none d-md-block w-100'>

       <div className='  fem'>
       <button className='btn btn-dark ' onClick={goback}><RiArrowGoBackLine /> Go Back</button>
       </div>
        <main className='d-flex'>
  
           <div className=' col-4 faap bg-light text-dark '>
            <div className=''>
            <h2  className='flmk'><IoChatbubblesOutline /> Chats</h2>
           
             </div>
            {showAllFriend&&
              showAllFriend.map((el,i)=>(
                <div className=' bg-danger' key={i}> 
                  <div onClick={()=> pressme(el,i)} className='d-flex bg-white text-dark align-items-center rounded  border my-1 p-1'>
                  <img src={el.profilePic} className='bluh' alt="" srcset="" />
                  <p className='mx-2 mt-3'>{capitalizeFirstLetter(el.username)} </p>
                  </div>
                </div>
              ))
            }
           

          </div>
            
          <div className='col-8 d-none bg-danger d-md-block beni p-2 position-relative'>
            {firs &&
              <main>
             <div>

            <div className='d-flex align-items-center  p-2 bg-light rounded'>
              <img src={display.profilePic} className='bluh mx-2' alt="" srcset="" />
              <h3>{display.username}</h3>
             </div>
            </div><hr />
            
            <div className="go ">
                            {best &&
                              best.map((el, i) => 
                              el.sender == display._id ? (
                                <div className=" bg-info vvo rounded rounded-3 my-1" key={i}>
                                  <p className="p-1 my-1 ">{el.content}</p>
                                  <p className="timer">{new Date(el.timestamp).toLocaleTimeString('en-US', { hour: "numeric", minute: 'numeric' })}</p>
                                </div>
                              ) : (
                                <div className=" vento rounded rounded-3  bg-primary-subtle my-1 " key={i}>
                                  <p className=" p-1 my-1">{el.content}</p>
                                  <p className="timeb">{new Date(el.timestamp).toLocaleTimeString('en-US', { hour: "numeric", minute: 'numeric' })}</p>
                                </div>
                              )
                              )}
                          </div>

            <div className='d-flex align-items-center position-absolute bottom-0 end-0 start-0 bg-white '>
              <p className='mt-1 ms-1'><ImFilePicture /></p>
              <input type="text" placeholder='Type a text' className='form-control mx-2' id="chatInput" onChange={(e)=>{setinputtext(e.target.value)}} />
              <button className='btn btn-primary  ' onClick={sendText}>Send</button>
            </div>
             
            </main>}
            {second && 
              <div className='text-center text-light mx-auto mt-5'>
                  <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quis sed, non perspiciatis omnis, dolore ut illum repudiandae, quisquam error quidem necessitatibus reprehenderit ipsum quam enim asperiores illo! Harum, illo doloribus.</p>
              </div>
            }
            </div>
            </main>
          
          </section>

          <section className='d-block d-md-none'>
            
       <div className='  fem'>
       <button className='btn btn-dark ' onClick={goback}><RiArrowGoBackLine /> Go Back</button>
       </div>
            <div>
           {femo && <div className=' col-md-4 faap bg-light text-dark '>
            <div className=''>
            <h2  className='flmk'><IoChatbubblesOutline /> Chats</h2>
           
             </div>
            {showAllFriend&&
              showAllFriend.map((el,i)=>(
                <div className=' bg-danger' key={i}> 
                  <div onClick={()=> pressme(el,i)} className='d-flex bg-white text-dark align-items-center rounded  border my-1 p-1'>
                  <img src={el.profilePic} className='bluh' alt="" srcset="" />
                  <p className='mx-2 mt-3'>{capitalizeFirstLetter(el.username)} </p>
                  </div>
                </div>
              ))
            }
           

          </div>}
            </div>
              
            {firs&& <main className='col-12 '>


 <div  className='d-flex align-align-items-center bg-light justify-content-between'>

<div className='d-flex align-items-center ksk  '>
  <img src={display.profilePic} className='bluh mx-2' alt="" srcset="" />
  <h3>{display.username}</h3>
</div><hr />
 <div>
  <button onClick={draw} className='btn btn-dark'>x</button>
 </div>
 </div>

<div className="go ">
                {best &&
                  best.map((el, i) => 
                  el.sender == display._id ? (
                    <div className=" bg-info vvo rounded rounded-3 my-1" key={i}>
                      <p className="p-1 my-1 ">{el.content}</p>
                      <p className="timer">{new Date(el.timestamp).toLocaleTimeString('en-US', { hour: "numeric", minute: 'numeric' })}</p>
                    </div>
                  ) : (
                    <div className=" vento rounded rounded-3  bg-primary-subtle my-1 " key={i}>
                      <p className=" p-1 my-1">{el.content}</p>
                      <p className="timeb">{new Date(el.timestamp).toLocaleTimeString('en-US', { hour: "numeric", minute: 'numeric' })}</p>
                    </div>
                  )
                  )}
              </div>

<div className='d-flex align-items-center position-absolute bottom-0 end-0 start-0 bg-white '>
  <p className='mt-1 ms-1'><ImFilePicture /></p>
  <input type="text" placeholder='Type a text' className='form-control mx-2' id="chatInput" onChange={(e)=>{setinputtext(e.target.value)}} />
  <button className='btn btn-primary  ' onClick={sendText}>Send</button>
</div>
 
</main>}
           
          </section>
        </main>  
    </> 
  )
}

export default Chat