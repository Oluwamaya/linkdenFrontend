import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'

import axios from 'axios';
import "./Style folder/Home.css";
import { MdKeyboardBackspace } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
const User = () => {
  
const userProfile = {
  profilePicture: 'src/eyeclose.png', 
  name: 'John Doe',
  bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  location: 'New York, USA',
  email : 'johndoe@gmial.com'
};

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
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));

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

    
  const [imagePreview, setImagePreview] = useState('');

  // const handleChange = (e) => {
  
  // };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      profilePicture: file,
    }));

    // Image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
  };

  return (
    <>

       <div className="profile-container">
      <div className="profile-header">
        <img src={first.profilePic} alt="Profile" className="profile-picture" />
        <div className="profile-info">
          <h2 className="profile-name">{first.username}</h2>
          <p className="profile-bio">{userProfile.bio}</p>
          <p className="profile-location">{userProfile.location}</p>
          <p className='profile-email'>{first.email}</p>
        </div>
      </div>
      <button  data-bs-toggle="modal" data-bs-target="#exampleModal"  className="edit-profile-button">Edit Profile</button>
    </div>

    <main className='mx-auto text-center slow py-2 px-4'> 
    <div className=' d-flex justify-content-between align-items-center my-2'>
    <button className='btn btn-dark 'onClick={goBack}><MdKeyboardBackspace /></button>

    <div className='drop3 position-relative '>
      <button onClick={showhide} className='sett btn  btn-dark rounded rounded-circle'><IoSettingsOutline className='fs-5' /></button>
      {hide &&
        <div className='down3 bg-dark text-light p-2 position-absolute'>
          <button  onClick={fede} className='btn btn-light p-2 rounded rounded-circle d-flrx my-1 justify-content-end '>X</button>
        <p className='mt-2'>Edit Profile</p>
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
                    
                    
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="profilePicture" className="block text-gray-700 font-semibold mb-2">
            Profile Picture
          </label>
          <input
            type="file"
            id="profilePicture"
            name="profilePicture"
            onChange={handleProfilePictureChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-indigo-500"
          />
          {imagePreview && (
            <div className="mt-2">
              <img src={imagePreview} alt="Profile Preview" className="max-w-full h-auto" />
            </div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="bio" className="block text-gray-700 font-semibold mb-2">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="4"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-indigo-500"
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="location" className="block text-gray-700 font-semibold mb-2">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700"
        >
          Save Changes
        </button>
      </form>
    </div>




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