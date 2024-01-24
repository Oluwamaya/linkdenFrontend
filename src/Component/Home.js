import React, { useState, useEffect } from "react";
import { FaRegComment } from "react-icons/fa";
import {  BsFillImageFill,BsHandThumbsUp,BsStar,BsStarFill,BsStarHalf,} from "react-icons/bs";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BiCalendar } from "react-icons/bi";
import { PiArticleMediumDuotone ,PiCamera,PiDotsThreeCircleVerticalThin} from "react-icons/pi";
import { FaRegCommentDots } from "react-icons/fa";
import "./Style folder/Home.css";
import "animate.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { CgLoadbar } from "react-icons/cg";
import { IoInformationCircleOutline } from "react-icons/io5";
import { FcLike } from "react-icons/fc";
import { GiSelfLove } from "react-icons/gi";
import "../App.css";


const Home = () => {
  const navigate = useNavigate();
  const [hideComment, sethideComment] = useState(false)
  const [isLiked, setisLiked] = useState(false);
  const [like, setlike] = useState([]);
  const [comments, setcomments] = useState();
  const [noPost, setnoPost] = useState('')
  const [caption, setcaption] = useState("");
  const [file, setfile] = useState("");
  const [editPic, seteditPic] = useState("")
  const [display, setdisplay] = useState([]);
  const [showInfo, setshowInfo] = useState({})
  const [showComment, setshowComment] = useState(Array(showInfo.length).fill(false));
  const [isCommentInputVisible, setCommentInputVisible] = useState(false);
  const [toggle, setToggle] = useState({});
  const [idpost, setidpost] = useState()
 const [delcom, setdelcom] = useState("")
 const [postIdForComment, setPostIdForComment] = useState(null);
 const [editcaption, seteditcaption] = useState("")
 const [hidepost, sethidepost] = useState(false)
 const [lock, setlock] = useState(true)


  const token = localStorage.getItem("Ln Token");
  
  useEffect(() => {
    axios.get("http://localhost:4345/users/verify",{
      headers:{
        Authorization: `bearer ${token}`
      }
    }).then((res)=>{
        console.log(res.data.message)
        setshowInfo(res.data.user)
        
      })
      .catch((error)=>{
        console.log(error);
        if (error.response.data.message === 'Operation `signups.findOne()` buffering timed out after 10000ms') {
          toast(error.response.statusText)
          navigate("/sign")
        }else{
        toast(error.response.data.message)
        navigate("/sign")
        }
        
      })
      
    }, [])
  useEffect(() => {
    axios
      .get("http://localhost:4345/users/getpost", {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      .then((res) => {
        setdisplay(res.data.posts);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.data === "Internal Server Error") {
          toast(error.response.statusText)
          navigate("/sign")
        }else{
          console.log(error)
        // toast(error.response.data.message)
        setnoPost(error.response.data.message)
        sethidepost(true)
        toast.error(error.response.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          });
        }
      });
  }, [display]);
  

  // useEffect(() => {
  //   console.log(display);
  // }, [display]);

  let result;
  const handleChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      result = reader.result;
      if (!result) {
        console.log("No picture uploaded");
      }
      setfile(result);
    };
  };

  const handleSubmit = (e) => {
    console.log(token);
    e.preventDefault();
    axios
      .post(
        "http://localhost:4345/users/posts",
        { file, caption },
        {
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        toast("Post successful")
        
        setlock(false)

      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: "Bounce",
          });
      });
  };
  let result2
   const handdleeditPic =(e)=>{
   const file =  e.target.files[0]
   const reader = new FileReader()
   reader.readAsDataURL(file);
   reader.onload = () => {
     result2 = reader.result;
     if (!result2) {
       console.log("No picture uploaded");
     }
     seteditPic(result2);
   };
   }
  function editPost(el, i) {
    console.log(i);
    console.log(el)
    const value =  {
      postId: el._id, 
      caption : editcaption,
      image: editPic,
      userId: showInfo._id
    }
    console.log(value);
    axios.post("http://localhost:4345/users/editPost", value)
    .then((res)=>{
   console.log(res)     
   setlock(false)
    }).catch(error =>{
console.log(error)
toast(error.response.data.error)
    })


  }

  function delPost(el, i){
    const value = {
       postId : el._id,
       userId: showInfo._id 
    }
    axios.post("http://localhost:4345/users/delpost", value)
    .then((res)=>{
      console.log(res)
      toast.success(res.data.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        // transition: "Bounce",
        });
    }).catch((error)=>{
      console.log(error)
      toast(error.response.data.error)
    })
  }
  
  const delComment = (com, i) =>{
    console.log(com._id)
   setdelcom(com._id)
   console.log(delcom)
   axios.post("http://localhost:4345/users/delcomment", {delcom})
   .then((res)=>{
    console.log(res)
    toast(res.data.message)
   }).catch((error)=>{
    console.log(error)
    toast(error.message)
   })
  }

  useEffect(() => {
    // Initialize the toggle state for each post based on whether the user has liked the post
    const initialToggleState = {};
    display.forEach((post) => {
      initialToggleState[post._id] = post.likes.includes(showInfo._id) ? "Unlike" : "Like";
    });
    setToggle(initialToggleState);
  }, [display, showInfo._id]);

  const handleLikeButton = async (i, el) => {
    const postId = el._id;
    // Map through the display array to find the post (el) and its likes
    const isLiked = el.likes.includes(showInfo._id);
    // Check if the post is liked
    if (isLiked) {
      console.log("yes");
      setToggle((prevToggle) => ({
        ...prevToggle,
        [postId]: "Like", // Update the toggle state for this post
      }));
    } else {
      setToggle((prevToggle) => ({
        ...prevToggle,
        [postId]: "Unlike", // Update the toggle state for this post
      }));
    }
    const value = {
      postId: el._id,
      userId: showInfo._id,
    };

    if (value) {
      axios
        .post("http://localhost:4345/users/getLike", value)
        .then((req) => {
          console.log(req);
        })
        .catch((error) => { 
          console.log(error);
        });
    } else {
      toast("Error occur try again");
    }

  };
  const handleComment = (postId,i)=>{
    setPostIdForComment(postId);
    setCommentInputVisible(true);
    setshowComment((inp)=>{
      const selBTN = [...inp];
      selBTN[i] = !selBTN[i]
      return selBTN
    })
    
  }
  function sendComment(postId, i){

    console.log(postId)
  
    const value = {
      postId,
      userId: showInfo,
      comments
    };
    console.log(value)
    axios.post("http://localhost:4345/users/getComment",value).then((res)=>{
      console.log(res)
      setCommentInputVisible(false);
    }).catch((error)=>{
      console.log(error)
    })
  }
  const capitalizeFirstLetter = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };
  const visible = ()=>{
    
    sethideComment(!hideComment)
  }
  const bammy = ()=>{
    if (sethideComment === true){
      sethideComment(false)
    }
  }
  return (
    <>
      <section onClick={bammy} className="d-flex justify-content-around bammy  text-light mt-5  ">
        <main className="w-100 d-flex justify-content-center opa">
        <section className="   col-sm-12 col-md-10 " >
          <main className=" ">
            
            {/* <button  className="golu btn btn-light"> + </button> */}
          <button className="golu c-button"data-bs-toggle="modal"
                data-bs-target="#exampleModal" >
  <span className="c-main">
    <span className="c-ico"><span className="c-blur"></span> <span className="ico-text">+</span></span>
    Post
  </span>
</button>

          </main>
          <center>
            {hidepost && 
            <div  className="mt-5 fence  rounded-3">
              <p className="  flot"><PiCamera/></p>
            
            <h4 className="fw-bolder h3  ">{noPost}</h4>
          </div>}</center>
          <main>
            {/* <!-- Button trigger modal --> */}

            {/* <!-- Modal --> */}
            {lock &&
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
                    <h1 class="modal-title fs-5 text-dark" id="exampleModalLabel">
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
                        type="text"
                        onChange={(e) => setcaption(e.target.value)}
                        name="caption"
                        className="my-2 form-control"
                        placeholder="Input Your Caption Here..."
                      />
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
                      onClick={handleSubmit}
                      // data-bs-dismiss="modal"
                      class="btn btn-primary"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
            }
          </main>

          <main className="reverse ">
            {display &&
              display.map((el, i) => (
                <div   key={i}>
                  <main className=" my-3 p-2  text-">
                    <div>
                    <div className="d-flex  justify-content-between align-items-center">

                    <div className="d-flex align-items-center p-2 ">
                      <img src={el.author.profilePic} className="bluh img-fluid " alt="" srcset="" />
                      <h5 className="px-2">{capitalizeFirstLetter(el.author.username)}</h5>
                    </div>
                    <div className="position-relative drop bg-bg-transparent " >
                   <button className="dots "><PiDotsThreeCircleVerticalThin /></button>
                    <div className="position-absolute down d-none">
                  {/* <button className=" btn btn-warning " >del</button> */}
                  
                  <button onClick={()=>delPost(el, i)} class="delete-button">
  <svg class="delete-svgIcon" viewBox="0 0 448 512">
                    <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                  </svg>
</button>

  <button data-bs-toggle="modal" data-bs-target={`#exampleModal${i}`} class="edit-button">
  <svg class="edit-svgIcon" viewBox="0 0 512 512">
                    <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                  </svg>
</button>
  </div>
                    </div>


{lock &&
<div class="modal fade" id={`exampleModal${i}`} tabindex="-1" aria-labelledby={`exampleModalLabel${i}`} aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id={`exampleModalLabel${i}`}>Edit Your Post😊</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <input type="text" onChange={(e)=>{seteditcaption(e.target.value)}}  />
        <input type="file" onChange={handdleeditPic} />
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" onClick={()=>editPost(el, i)}  className="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>}
                    
                    </div>

                    <div className="text-center">
                      <div className="mango text-start">
                      <p className="fs-6  fw-bold  ">{capitalizeFirstLetter(el.caption)}</p>
                      </div>
                      <div>

                      <img
                        src={el.image}
                        className="news img-fluid "
                        
                        alt=""
                        srcset=""
                        />
                        </div>
                    </div>

                    <div className="mango ">
                      
                      <p>{el.likes?   el.likes.length : 0} Likes</p>
                      <button
                        onClick={() => handleLikeButton(i, el)}
                        className="btn border bg-transparent text-light mx-2 "
                      >
                        {toggle[el._id] === "Unlike"? <FcLike />: <GiSelfLove/>}
                      </button>

                      <button onClick={()=> handleComment(el._id, i)} className="btn border bg-transparent"><FaRegComment  className="text-light"/></button>
                      {showComment[i] && (

                      <div className="d-flex bg-light-subtle p-2  " key={i}> 
                       
                      {isCommentInputVisible && (
                        <>
                          <input
                          placeholder="Add a comment..."
                            className="form-control mx-3"
                            type="text"
                            onChange={(e) => {
                              setcomments(e.target.value);
                            }}
                          />
                          <button
                            className="btn btn-dark"
                            onClick={() => sendComment(el._id, i)}
                          >
                            send
                          </button>
                        </>
                      )}
                      </div>
                      
                      )}
                        <p className="" onClick={visible}>{el.comments ? el.comments.length : "" } comments</p>
                     {hideComment&&
                      <div className="bg-secondary  mt-3 wor">
                        <center><CgLoadbar  className="line"/></center>
                        <div className="d-flex  align-align-items-center  justify-content-between ">
                          <center className="fw-bold px-2">Comments</center>
                          <p className=" fs-4"><IoInformationCircleOutline /></p>
                        </div>
                        {
                           el.comments.map((com, i)=>(
                            <div  key={i} className=" p-2 text-dark">
                              
                            <div className="text-light bg-dark  border-bottom p-1">
                              <div className="d-flex justify-content-between  align-items-center">
                              <div className="d-flex align-items-center ">
                              <img src={com.userId.profilePic} className="bluk img-fluid me-2" alt="" srcset="" />
                              <h6>{capitalizeFirstLetter(com.userId.username)}</h6>
                              </div>
                             <div>
                             <button onClick={(e)=>delComment(com, i)} className="btn btn-light fs-6">X</button>
                             </div>
                              </div>
                              
                              <p className="mx-5 lead">{capitalizeFirstLetter(com.comment)}</p>
                            </div>
                            </div>
                           ))
                        }
                      </div>}
                    </div>
                </div> 
                 </main><hr />
                </div>
              ))}
          </main>
        </section>
        </main>
      </section>
      <ToastContainer />
    </>
  );
};

export default Home;
