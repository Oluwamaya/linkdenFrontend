import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { ImFilePicture } from "react-icons/im";

const Chat = () => {
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
            console.log(res.data.message)
            setfirst(res.data.user)
            console.log(res.data.user)
          })
          .catch((error)=>{
            console.log(error);
            alert(error.response.data.message)
            navigate("/sign")
            
            
          })
          
        }, [])

     useEffect(() => {
    axios.get("http://localhost:4345/users/findallUser")
    .then((res)=>{
        console.log(res)
    })
    .catch((err)=>{
        console.log(err)
    })
     }, [])
     
     const pressme =()=>{
      setsecond(false)
      setfirs(true)
     }
     function sendText() {
      console.log(inputtext);
     }



  return (
    <>
       <main className='container-fluid  row'> 
          <div className='col-12 col-md-4  bg-dark text-light'>
            <h2>Chats</h2><hr />
            <p onClick={pressme}>Ajani </p>
           

          </div>
          <div className='col-8 d-none bg-danger d-md-block beni p-2 position-relative'>
            {firs &&
              <main>

            <div className='d-flex align-items-center  p-2 bg-light rounded'>
              <img src={require("../image/3.jpg")} className='bluh mx-2' alt="" srcset="" />
              <h3>UserName</h3>
            </div><hr />
            <div>
              
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