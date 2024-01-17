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
      console.log(el);
      console.log(i);
      setdisplay(el)
      
      
     }
     function sendText() {
      console.log(inputtext);
     }
     function goback(){
      navigate("/dashboard/Home")
    }
     
     const capitalizeFirstLetter = (word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    };
  return (
    <>
       <main className='container-fluid  row  '>
        
          
          
       <div className=' text-end  fem'>
       <button className='btn btn-dark ' onClick={goback}><RiArrowGoBackLine /> Go Back</button>
       </div>
  
          <div className='col-12 col-md-4 faap bg-dark'>
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

            <div className='d-flex align-items-center  p-2 bg-light rounded'>
              <img src={display.profilePic} className='bluh mx-2' alt="" srcset="" />
              <h3>{display.username}</h3>
            </div><hr />
            <div>
              <p className='text-end text-dark bg-light'>maya how far</p>
              <p className='bg-dark text-light'>my gee i dey </p>
            </div>
            <div className='d-flex align-items-center position-absolute bottom-0 end-0 start-0 bg-white '>
              <p className='mt-1 ms-1'><ImFilePicture /></p>
              <input type="text" placeholder='Type a text' className='form-control mx-2' id="" onChange={(e)=>{setinputtext(e.target.value)}} />
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
    </> 
  )
}

export default Chat