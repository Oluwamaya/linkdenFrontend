import React, { useState, useEffect } from "react";
// import {AiFillStar ,AiOutlineStar} from 'react-icons/ai'
import {
  BsFillImageFill,
  BsHandThumbsUp,
  BsStar,
  BsStarFill,
  BsStarHalf,
} from "react-icons/bs";
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

const Home = () => {
  const navigate = useNavigate();
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
  const [toggle, setToggle] = useState({});
  const [idpost, setidpost] = useState()
 const [delcom, setdelcom] = useState("")
 const [postIdForComment, setPostIdForComment] = useState(null);
 const [editcaption, seteditcaption] = useState("")
 const [hidepost, sethidepost] = useState(false)

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
      })
      .catch((error) => {
        console.log(error);
        toast(error.response.data);
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
    console.log(el)
    const value =  {
      postId: el._id, 
      caption : editcaption,
      image: editPic,
      userId: showInfo._id
    }
    axios.post("http://localhost:4345/users/editPost", value)
    .then((res)=>{
   console.log(res)     
    
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
    }).catch((error)=>{
      console.log(error)
    })
  }
  const capitalizeFirstLetter = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  return (
    <>
      <section className="d-flex justify-content-around bammmy  text-light mt-5 border ">
        {/* <main className="col-3 bg-danger hom">
          <div>
            <p className="may">
              {" "}
              <BsStarFill />
              <BsStarHalf />
              <BsStar />
              <BsStar />
            </p>
          </div>
        </main> */}
        <section className=" mx-4 mt-2 bg-black col-11 col-md-10 " >
          <main className="bg-dark text-light py-3 me-2 rounded">
            <div className="d-flex align-items-center  px-2  ">
              <img
                src={showInfo && showInfo.profilePic}
                className="bluh img-fluid "
                alt=""
                srcset=""
              />

              <button
                type="button"
                className=" border-0 w-100 rounded-4 mx-4 p-2 text-start"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              >
                start a post
              </button>
            </div>
            <div className="d-flex justify-content-around">
              <div className="d-flex  align-items-center">
                <p>
                  {" "}
                  <BsFillImageFill />{" "}
                </p>
                <p className="ms-2">media </p>
              </div>
              <div className="d-flex  align-items-center">
                <p>
                  <BiCalendar />
                </p>
                <p className="ms-2">Event</p>
              </div>
              <div className="d-flex  align-items-center">
                <p>
                  <PiArticleMediumDuotone />
                </p>
                <p className="ms-2">Write</p>
              </div>
            </div>
          </main>
          <center>
            {hidepost && 
            <div  className="mt-5 fence border rounded-3">
              <p className="  flot"><PiCamera/></p>
            
            <h4 className="fw-bolder h3  ">{noPost}</h4>
          </div>}</center>
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
                        type="text"
                        onChange={(e) => setcaption(e.target.value)}
                        name="caption"
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
                      class="btn btn-primary"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>

          <main className="reverse ">
            {display &&
              display.map((el, i) => (
                <div   key={i}>
                  <main className="border border-bg-success my-3 p-2">
                    <div className="d-flex justify-content-between align-items-center">

                    <div className="d-flex align-items-center p-2 ">
                      <img src={el.author.profilePic} className="bluh img-fluid " alt="" srcset="" />
                      <h5 className="px-2">{capitalizeFirstLetter(el.author.username)}</h5>
                    </div>
                    <div className="position-relative drop bg-bg-transparent " >
                   <button className="dots "><PiDotsThreeCircleVerticalThin /></button>
                    <div className="position-absolute down d-none">
                  <button className=" btn btn-warning " onClick={()=>delPost(el, i)}>del</button>
                  {/* <button className="btn btn-success">edit</button> */}
                  
<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal1">
  edit
  </button>
  </div>
                    </div>



<div class="modal fade" id="exampleModal1" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Edit Your Post😊</h1>
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
</div>
                    
                    </div>

                    <div>
                      <p className="fs-6  fw-bold ">{capitalizeFirstLetter(el.caption)}</p>
                      <img
                        src={el.image}
                        className="news img-fluid"
                        alt=""
                        srcset=""
                      />
                    </div>

                    <div className="">
                      
                      <p>{el.likes?   el.likes.length : 0} Likes</p>
                      <button
                        onClick={() => handleLikeButton(i, el)}
                        className="btn btn-primary mx-2"
                      >
                        {toggle[el._id]}
                      </button>

                      <button onClick={()=> handleComment(el._id, i)} className="btn btn-primary">Comment</button>
                      {showComment[i] && (

                      <div className="d-flex " key={i}> 
                        <input className="form-control mx-3" type="text" onChange={(e)=>{setcomments(e.target.value)}}/>
                        <button className="btn btn-dark" onClick={()=>sendComment(el, i)}>send</button> 
                      </div>
                      
                      )}
                      <div>

                        <p>{el.comments ? el.comments.length : "" } comments</p>
                        {
                           el.comments.map((com, i)=>(
                            <div key={i} className="text-light bg-dark border-bottom p-2">
                              <div className="d-flex align-items-center ">
                              <img src={com.userId.profilePic} className="bluk img-fluid me-2" alt="" srcset="" />
                              <h6>{capitalizeFirstLetter(com.userId.username)}</h6>
                              </div>
                              <p>{com.comment}</p>
                              <button onClick={(e)=>delComment(com, i)} className="btn btn-danger">X</button>
                            </div>
                           ))
                        }
                      </div>
                    </div>
                  </main><hr />
                </div>
              ))}
          </main>
        </section>
      </section>
      <ToastContainer />
    </>
  );
};

export default Home;
