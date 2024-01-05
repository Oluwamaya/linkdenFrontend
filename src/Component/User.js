import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import 'bootstrap/dist/js/bootstrap.bundle.min'
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import "./Style folder/Home.css";

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
  
  return (
    <>
    <main className='mx-auto text-center'> 

       <div className='col-8 bg-danger mx-auto rounded slow p-4 position-relative '> 
        <img src={first.profilePic} className='blum img-fluid ' alt="photo" />
       
           <button className='btn btn-dark position-absolute end-0 top-0'onClick={goBack}>X</button>
         <div className='position-absolute top-0  start-0 '>
         <button
                type="button"
                className="btn btn-dark "
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              >
                Edit Profile
              </button>
         
         
         </div>


         <p className='text-light h3 fw-bold'>Dear: {first.username}</p>
         <button className='btn btn-dark' onClick={LogOut}>Logout</button>
        
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
                      "Post and Connect!"
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