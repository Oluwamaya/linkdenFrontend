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
   const token = localStorage.getItem("Ln Token");
  

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
       axios.post("http://localhost:4345/users/propic",{file},
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
     const capitalizeFirstLetter = async (word) => {
      return  word.charAt(0).toUpperCase() + word.slice(1);
    };
  return (
    <>
    <main className='mx-auto text-center slow py-2 px-4'> 
    <div className=' d-flex justify-content-between align-items-center my-2'>
    <button className='btn btn-dark 'onClick={goBack}><MdKeyboardBackspace /></button>
      <button onClick={gbemi} className='sett btn  btn-dark rounded rounded-circle'><IoSettingsOutline className='fs-5' /></button>

    </div>
       <div className='col-sm-12  col-md-6  mx-auto rainbo  p-2 '> 
        <img src={first.profilePic} className='blum img-fluid ' alt="photo" />
       
           
         <div className=''>
         <button
                type="button"
                className=" btn btn-secondary my-2 "
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              >
                Edit Profile
              </button>
         
         
         </div>


         <p className='text-light h3 fw-bold'> {first.username}</p>
         <p className='text-light h3 fw-bold kenni'> {first.email}</p>
         
         {/* <button className='btn btn-dark' >Logout</button> */}
        
        <div className='w-100 justify-content-center d-flex'>
           <button onClick={LogOut}  class="Btn ">
<div className="sign ms-3"><svg viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path></svg></div>
  
  {/* <div className="text"><b>Logout</b></div> */}
  <b className=' px-2  '>LogOut</b>
</button>

          </div>


        
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