import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'

import axios from 'axios';
import "./Style folder/Home.css";
import { MdKeyboardBackspace } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
const User = () => {
  const navigate = useNavigate()
  const [first, setfirst] = useState(true)
  const [file, setfile] = useState('')
  const [hide , setHide] = useState(false)
   const token = localStorage.getItem("Ln Token");
  

useEffect(() => {
  axios.get("https://lnbackend.onrender.com/users/verify",{
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

       const LogOut = () =>{
      localStorage.removeItem("Ln Token")
      localStorage.removeItem("userInfo") 
     alert("User Logged Out")
  navigate("/sign")
       }
       let result;
        const handleChange= (e)=>{
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload =(e)=>{
       result = reader.result
       setfile(result)
      }

        }

     function handleProfile(){
       axios.post("https://lnbackend.onrender.com/users/propic",{file},
       {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
       .then(res =>{
        console.log(res)
        alert("ProfilePicture posted")
        window.location.reload()
        
        // localStorage.setItem("userInfo", JSON.stringify(res))
       }).catch((error)=>{
        console.log(error)
       })
    
     }
     function goBack(){
      navigate("/dashboard/Home")
     }
     const gbemi =()=>{
      navigate("/YourReview")
     }
     const showhide= ()=>{
      setHide(true)
     }
     const fede =()=>{
      setHide(false)
     }

     const capitalizeFirstLetter = async (word) => {
      return  word.charAt(0).toUpperCase() + word.slice(1);
    };
  return (
    <>
    <main className='mx-auto text-center slow py-2 px-4'> 
    <div className=' d-flex justify-content-between align-items-center my-2'>
    <button className='btn btn-dark 'onClick={goBack}><MdKeyboardBackspace /></button>

    <div className='drop3 position-relative '>
      <button onClick={showhide} className='sett btn  btn-dark rounded rounded-circle'><IoSettingsOutline className='fs-5' /></button>
      {hide &&
        <div className='down3 bg-dark text-light p-2 position-absolute'>
          <button  onClick={fede} className='btn btn-light p-2 rounded rounded-circle d-flrx my-1 justify-content-end '>X</button>
        <p className='mt-2' data-bs-toggle="modal"
                data-bs-target="#exampleModal" >Edit Profile</p>
        <p onClick={gbemi}>Contact Us</p>
        <p onClick={LogOut} >LogOut</p>
      </div>}
    </div>

    </div>
       <div className='col-sm-12  col-md-6  mx-auto rainbo  p-2 '> 
        <img src={first.profilePic} className='blum img-fluid ' alt="photo" />
         <p className='text-dark h3 fw-bold'> {first.username}</p>
         <p className='text-dark h3 fw-bold kenni'> {first.email}</p>

         <center className='fw-bold f6'>{first.friends &&  first.friends.length} Friends</center>
         
         {/* <button className='btn btn-dark' >Logout</button> */}
        
       


        
       </div>
    </main>
    <main>
            {/* <!-- Button trigger modal --> */}

            {/* <!-- Modal --> */}
            <div
              class="modal fade"
              id="exampleModal"
              tabindex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">
                      Edit Profile Image
                    </h1>
                    <button
                      type="button"
                      class="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div class="modal-body">
                    

                    <div>
                      <input
                        type="file"
                        name=""
                        onChange={handleChange}
                        id=""
                      />
                    </div>
                    {/* <button type='submit'>Post</button> */}
                  </div>
                  <div class="modal-footer">
                    <button
                      type="button"
                      class="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      onClick={handleProfile}
                      class="btn btn-primary fw-bold"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
          
    </>
  )
}

export default User