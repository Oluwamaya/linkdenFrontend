import React, { useState, useEffect } from "react";
import { FaRegComment } from "react-icons/fa";
import { BsFillImageFill, BsHandThumbsUp, BsStar, BsStarFill, BsStarHalf, } from "react-icons/bs";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BiCalendar } from "react-icons/bi";
import { PiArticleMediumDuotone, PiCamera, PiDotsThreeCircleVerticalThin } from "react-icons/pi";
import { FaRegCommentDots } from "react-icons/fa";
import "./Style folder/Home.css";
import "animate.css";
import axios from "axios";
import { Link, Outlet } from "react-router-dom";
import { BiSolidMessageRoundedDots } from "react-icons/bi";
import { IoMdNotifications } from "react-icons/io";
import { FaPeopleRobbery } from "react-icons/fa6";
import { AiFillHome } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { CgLoadbar } from "react-icons/cg";
import { IoInformationCircleOutline } from "react-icons/io5";
import { FcLike } from "react-icons/fc";
import { GiSelfLove } from "react-icons/gi";
import { ImBin } from "react-icons/im";
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
    axios.get("https://lnbackend.onrender.com/users/verify", {
      headers: {
        Authorization: `bearer ${token}`
      }
    }).then((res) => {
      console.log(res.data.message)
      setshowInfo(res.data.user)

    })
      .catch((error) => {
        console.log(error);
        if (error.response.data.message === 'Operation `signups.findOne()` buffering timed out after 10000ms') {
          toast(error.response.statusText)
          navigate("/sign")
        } else {
          toast(error.response.data.message)
          navigate("/sign")
        }

      })

  }, [])
  useEffect(() => {
    axios
      .get("https://lnbackend.onrender.com/users/getpost", {
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
        } else {
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
        "https://lnbackend.onrender.com/users/posts",
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
  const handdleeditPic = (e) => {
    const file = e.target.files[0]
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
    const value = {
      postId: el._id,
      caption: editcaption,
      image: editPic,
      userId: showInfo._id
    }
    console.log(value);
    axios.post("https://lnbackend.onrender.com/users/editPost", value)
      .then((res) => {
        console.log(res)
        setlock(false)
        window.location.reload();
      }).catch(error => {
        console.log(error)
        toast(error.response.data.error)
      })


  }

  function delPost(el, i) {
    const value = {
      postId: el._id,
      userId: showInfo._id
    }
    axios.post("https://lnbackend.onrender.com/users/delpost", value)
      .then((res) => {
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
      }).catch((error) => {
        console.log(error)
        toast(error.response.data.error)
      })
  }

  const delComment = (com, i) => {
    console.log(com._id)
    setdelcom(com._id)
    console.log(delcom)
    axios.post("https://lnbackend.onrender.com/users/delcomment", { delcom })
      .then((res) => {
        console.log(res)
        toast(res.data.message)
      }).catch((error) => {
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
        .post("https://lnbackend.onrender.com/users/getLike", value)
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
  const handleComment = (postId, i) => {
    setPostIdForComment(postId);
    setCommentInputVisible(true);
    setshowComment((inp) => {
      const selBTN = [...inp];
      selBTN[i] = !selBTN[i]
      return selBTN
    })

  }
  function sendComment(postId, i) {

    console.log(postId)

    const value = {
      postId,
      userId: showInfo,
      comments
    };
    console.log(value)
    axios.post("https://lnbackend.onrender.com/users/getComment", value).then((res) => {
      console.log(res)
      setCommentInputVisible(false);
    }).catch((error) => {
      console.log(error)
    })
  }
  const capitalizeFirstLetter = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };
  const visible = () => {

    sethideComment(!hideComment)
  }
  const bammy = () => {
    if (sethideComment === true) {
      sethideComment(false)
    }
  }

  const closer = () =>{
      sethideComment(false)
  }
  return (
    <>
      <section onClick={bammy} className="d-flex justify-content-around bammy  text-light mt-5  ">
        <main className="w-100 d-flex justify-content-center opa">
          <section className="   col-sm-12 col-md-10 " >
            <main className=" ">

              {/* <button  className="golu btn btn-light"> + </button> */}
              <button className="golu c-button" data-bs-toggle="modal"
                data-bs-target="#exampleModal" >
                <span className="c-main">
                  <span className="c-ico"><span className="c-blur"></span> <span className="ico-text">+</span></span>
                  Post
                </span>
              </button>

            </main>
            <center>
              {hidepost &&
                <div className="mt-5 fence  rounded-3">
                  <p className="  flot"><PiCamera /></p>

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

            <main className="reverse">
              {display &&
                display.map((el, i) => (
                  <div key={i}>
                    <main className=" my-3 text- bork1">
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

                              <button onClick={() => delPost(el, i)} class="delete-button">
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
                                    <input type="text" onChange={(e) => { seteditcaption(e.target.value) }} />
                                    <input type="file" onChange={handdleeditPic} />
                                  </div>
                                  <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="button" onClick={() => editPost(el, i)} className="btn btn-primary">Save changes</button>
                                  </div>
                                </div>
                              </div>
                            </div>}

                        </div>

                        <div className="text-center mano1">
                          <div className="mango text-start">
                            <p className="fs-6  fw-bold  ">{capitalizeFirstLetter(el.caption)}</p>
                          </div>
                          <div className="" >

                            <img
                              src={el.image}
                              className="news  "

                              alt=""
                              srcset=""
                            />
                          </div>
                        </div>

                        <div className="mango ">

                          <p>{el.likes ? el.likes.length : 0} Likes</p>
                          <div className="bg12 ">
                            <button
                              onClick={() => handleLikeButton(i, el)}
                              className="btn border bg-transparent text-light mx-2 "
                            >
                              {toggle[el._id] === "Unlike" ? <FcLike /> : <GiSelfLove />}
                            </button>

                            <button onClick={() => handleComment(el._id, i)} className="btn border bg-transparent"><FaRegComment className="text-light" /></button>

                          </div>
                          {showComment[i] && (

                            <div className="d-flex p-2  " key={i}>

                              {isCommentInputVisible && (
                                <>
                                  <input
                                    placeholder="Add a comment..."
                                    className="form-control mez1 mx-2"
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
                          <p className="" onClick={visible}>{el.comments ? el.comments.length : ""} comments</p>
                          {hideComment &&
                            <div className="wor">
                              <center onClick={closer}><CgLoadbar className="line" /></center>
                              <div className="d-flex  align-align-items-center  justify-content-between ">
                                <center className="fw-bold px-2">Comments</center>
                                <p className="fs-4"><IoInformationCircleOutline /></p>
                              </div>
                              {
                                el.comments.map((com, i) => (
                                  <div key={i} className=" p-1 text-dark">

                                    <div className="text-light border-bottom p-1 beg4">
                                      <div className="d-flex justify-content-between  align-items-center">
                                        <div className="d-flex align-items-center ">
                                          <img src={com.userId.profilePic} className="bluk img-fluid me-2" alt="" srcset="" />
                                          <h6>{capitalizeFirstLetter(com.userId.username)}</h6>
                                        </div>
                                        <div>
                                          <button onClick={(e) => delComment(com, i)} className="btn text-light fs-6"> <ImBin /></button>
                                        </div>
                                      </div>

                                    <div className="lead container container-fluid"><p className="mx-4">{capitalizeFirstLetter(com.comment)}</p></div>
                                    </div>
                                  </div>
                                ))
                              }
                            </div>}
                        </div>
                      </div>
                    </main>
                  </div>
                ))}
            </main>
          </section>
        </main>

        <main className="wof1">
          <div class="input81">
            <button class="value">
              <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" data-name="Layer 2"><path fill="#7D8590" d="m1.5 13v1a.5.5 0 0 0 .3379.4731 18.9718 18.9718 0 0 0 6.1621 1.0269 18.9629 18.9629 0 0 0 6.1621-1.0269.5.5 0 0 0 .3379-.4731v-1a6.5083 6.5083 0 0 0 -4.461-6.1676 3.5 3.5 0 1 0 -4.078 0 6.5083 6.5083 0 0 0 -4.461 6.1676zm4-9a2.5 2.5 0 1 1 2.5 2.5 2.5026 2.5026 0 0 1 -2.5-2.5zm2.5 3.5a5.5066 5.5066 0 0 1 5.5 5.5v.6392a18.08 18.08 0 0 1 -11 0v-.6392a5.5066 5.5066 0 0 1 5.5-5.5z"></path></svg>
              Public profile
            </button>
            <button class="value">
              <svg id="Line" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path fill="#7D8590" id="XMLID_1646_" d="m17.074 30h-2.148c-1.038 0-1.914-.811-1.994-1.846l-.125-1.635c-.687-.208-1.351-.484-1.985-.824l-1.246 1.067c-.788.677-1.98.631-2.715-.104l-1.52-1.52c-.734-.734-.78-1.927-.104-2.715l1.067-1.246c-.34-.635-.616-1.299-.824-1.985l-1.634-.125c-1.035-.079-1.846-.955-1.846-1.993v-2.148c0-1.038.811-1.914 1.846-1.994l1.635-.125c.208-.687.484-1.351.824-1.985l-1.068-1.247c-.676-.788-.631-1.98.104-2.715l1.52-1.52c.734-.734 1.927-.779 2.715-.104l1.246 1.067c.635-.34 1.299-.616 1.985-.824l.125-1.634c.08-1.034.956-1.845 1.994-1.845h2.148c1.038 0 1.914.811 1.994 1.846l.125 1.635c.687.208 1.351.484 1.985.824l1.246-1.067c.787-.676 1.98-.631 2.715.104l1.52 1.52c.734.734.78 1.927.104 2.715l-1.067 1.246c.34.635.616 1.299.824 1.985l1.634.125c1.035.079 1.846.955 1.846 1.993v2.148c0 1.038-.811 1.914-1.846 1.994l-1.635.125c-.208.687-.484 1.351-.824 1.985l1.067 1.246c.677.788.631 1.98-.104 2.715l-1.52 1.52c-.734.734-1.928.78-2.715.104l-1.246-1.067c-.635.34-1.299.616-1.985.824l-.125 1.634c-.079 1.035-.955 1.846-1.993 1.846zm-5.835-6.373c.848.53 1.768.912 2.734 1.135.426.099.739.462.772.898l.18 2.341 2.149-.001.18-2.34c.033-.437.347-.8.772-.898.967-.223 1.887-.604 2.734-1.135.371-.232.849-.197 1.181.089l1.784 1.529 1.52-1.52-1.529-1.784c-.285-.332-.321-.811-.089-1.181.53-.848.912-1.768 1.135-2.734.099-.426.462-.739.898-.772l2.341-.18h-.001v-2.148l-2.34-.18c-.437-.033-.8-.347-.898-.772-.223-.967-.604-1.887-1.135-2.734-.232-.37-.196-.849.089-1.181l1.529-1.784-1.52-1.52-1.784 1.529c-.332.286-.81.321-1.181.089-.848-.53-1.768-.912-2.734-1.135-.426-.099-.739-.462-.772-.898l-.18-2.341-2.148.001-.18 2.34c-.033.437-.347.8-.772.898-.967.223-1.887.604-2.734 1.135-.37.232-.849.197-1.181-.089l-1.785-1.529-1.52 1.52 1.529 1.784c.285.332.321.811.089 1.181-.53.848-.912 1.768-1.135 2.734-.099.426-.462.739-.898.772l-2.341.18.002 2.148 2.34.18c.437.033.8.347.898.772.223.967.604 1.887 1.135 2.734.232.37.196.849-.089 1.181l-1.529 1.784 1.52 1.52 1.784-1.529c.332-.287.813-.32 1.18-.089z"></path><path id="XMLID_1645_" fill="#7D8590" d="m16 23c-3.859 0-7-3.141-7-7s3.141-7 7-7 7 3.141 7 7-3.141 7-7 7zm0-12c-2.757 0-5 2.243-5 5s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z"></path></svg>
              Account
            </button>
            <button class="value">
              <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg"><path fill="#7D8590" d="m109.9 20.63a6.232 6.232 0 0 0 -8.588-.22l-57.463 51.843c-.012.011-.02.024-.031.035s-.023.017-.034.027l-4.721 4.722a1.749 1.749 0 0 0 0 2.475l.341.342-3.16 3.16a8 8 0 0 0 -1.424 1.967 11.382 11.382 0 0 0 -12.055 10.609c-.006.036-.011.074-.015.111a5.763 5.763 0 0 1 -4.928 5.41 1.75 1.75 0 0 0 -.844 3.14c4.844 3.619 9.4 4.915 13.338 4.915a17.14 17.14 0 0 0 11.738-4.545l.182-.167a11.354 11.354 0 0 0 3.348-8.081c0-.225-.02-.445-.032-.667a8.041 8.041 0 0 0 1.962-1.421l3.16-3.161.342.342a1.749 1.749 0 0 0 2.475 0l4.722-4.722c.011-.011.018-.025.029-.036s.023-.018.033-.029l51.844-57.46a6.236 6.236 0 0 0 -.219-8.589zm-70.1 81.311-.122.111c-.808.787-7.667 6.974-17.826 1.221a9.166 9.166 0 0 0 4.36-7.036 1.758 1.758 0 0 0 .036-.273 7.892 7.892 0 0 1 9.122-7.414c.017.005.031.014.048.019a1.717 1.717 0 0 0 .379.055 7.918 7.918 0 0 1 4 13.317zm5.239-10.131c-.093.093-.194.176-.293.26a11.459 11.459 0 0 0 -6.289-6.286c.084-.1.167-.2.261-.3l3.161-3.161 6.321 6.326zm7.214-4.057-9.479-9.479 2.247-2.247 9.479 9.479zm55.267-60.879-50.61 56.092-9.348-9.348 56.092-50.61a2.737 2.737 0 0 1 3.866 3.866z"></path></svg>
              Appearance
            </button>
            <button class="value">
              <svg id="svg8" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g id="layer1" transform="translate(-33.022 -30.617)"><path fill="#7D8590" id="path26276" d="m49.021 31.617c-2.673 0-4.861 2.188-4.861 4.861 0 1.606.798 3.081 1.873 3.834h-7.896c-1.7 0-3.098 1.401-3.098 3.1s1.399 3.098 3.098 3.098h4.377l.223 2.641s-1.764 8.565-1.764 8.566c-.438 1.642.55 3.355 2.191 3.795s3.327-.494 3.799-2.191l2.059-5.189 2.059 5.189c.44 1.643 2.157 2.631 3.799 2.191s2.63-2.153 2.191-3.795l-1.764-8.566.223-2.641h4.377c1.699 0 3.098-1.399 3.098-3.098s-1.397-3.1-3.098-3.1h-7.928c1.102-.771 1.904-2.228 1.904-3.834 0-2.672-2.189-4.861-4.862-4.861zm0 2c1.592 0 2.861 1.27 2.861 2.861 0 1.169-.705 2.214-1.789 2.652-.501.203-.75.767-.563 1.273l.463 1.254c.145.393.519.654.938.654h8.975c.626 0 1.098.473 1.098 1.1s-.471 1.098-1.098 1.098h-5.297c-.52 0-.952.398-.996.916l-.311 3.701c-.008.096-.002.191.018.285 0 0 1.813 8.802 1.816 8.82.162.604-.173 1.186-.777 1.348s-1.184-.173-1.346-.777c-.01-.037-3.063-7.76-3.063-7.76-.334-.842-1.525-.842-1.859 0 0 0-3.052 7.723-3.063 7.76-.162.604-.741.939-1.346.777s-.939-.743-.777-1.348c.004-.019 1.816-8.82 1.816-8.82.02-.094.025-.189.018-.285l-.311-3.701c-.044-.518-.477-.916-.996-.916h-5.297c-.627 0-1.098-.471-1.098-1.098s.472-1.1 1.098-1.1h8.975c.419 0 .793-.262.938-.654l.463-1.254c.188-.507-.062-1.07-.563-1.273-1.084-.438-1.789-1.483-1.789-2.652.001-1.591 1.271-2.861 2.862-2.861z"></path></g></svg>
              Accessibility
            </button>
            <button class="value">
              <svg fill="none" viewBox="0 0 24 25" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" d="m11.9572 4.31201c-3.35401 0-6.00906 2.59741-6.00906 5.67742v3.29037c0 .1986-.05916.3927-.16992.5576l-1.62529 2.4193-.01077.0157c-.18701.2673-.16653.5113-.07001.6868.10031.1825.31959.3528.67282.3528h14.52603c.2546 0 .5013-.1515.6391-.3968.1315-.2343.1117-.4475-.0118-.6093-.0065-.0085-.0129-.0171-.0191-.0258l-1.7269-2.4194c-.121-.1695-.186-.3726-.186-.5809v-3.29037c0-1.54561-.6851-3.023-1.7072-4.00431-1.1617-1.01594-2.6545-1.67311-4.3019-1.67311zm-8.00906 5.67742c0-4.27483 3.64294-7.67742 8.00906-7.67742 2.2055 0 4.1606.88547 5.6378 2.18455.01.00877.0198.01774.0294.02691 1.408 1.34136 2.3419 3.34131 2.3419 5.46596v2.97007l1.5325 2.1471c.6775.8999.6054 1.9859.1552 2.7877-.4464.795-1.3171 1.4177-2.383 1.4177h-14.52603c-2.16218 0-3.55087-2.302-2.24739-4.1777l1.45056-2.1593zm4.05187 11.32257c0-.5523.44772-1 1-1h5.99999c.5523 0 1 .4477 1 1s-.4477 1-1 1h-5.99999c-.55228 0-1-.4477-1-1z" fill="#7D8590" fill-rule="evenodd"></path></svg>
              Notifications
            </button>
          </div>
          <div className="pt-3 px-2 m-2 gap-3 justify-content-between bov4 align-items-center">
            <Link
              to={"/Dashboard/Home"}
              className=" d-flex align-items-center text-decoration-none color text-white lin  fs-5 gap-2  "
            >
              <AiFillHome className="" />
              Home
            </Link>
            <Link
              to={"/dashboard/Network"}
              className="d-flex align-items-center  text-decoration-none color text-white lin  fs-5 gap-2 my-3"
            >
              <FaPeopleRobbery />
              My Network
            </Link>

            <Link
              to={"/chats"}
              className="d-flex align-items-center  text-decoration-none color text-white lin  fs-5 gap-2 my-3"
            >
              <BiSolidMessageRoundedDots />
              Messaging
            </Link>
            <Link
              to={"/notifications"}
              className="d-flex align-items-center  text-decoration-none  lin text-white   fs-5 gap-2 my-3"
            >
              <IoMdNotifications />
              Notification
            </Link>


          </div>
          <div className="pt-3 px-2 m-2 gap-3 justify-content-between bov4 align-items-center">
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempora nobis tempore fuga repudiandae reiciendis unde laudantium rem alias impedit corrupti, ipsam asperiores.</p>
          </div>


        </main>
        {/* <main className="voj3">
        <div className="d-flex p-2 px-4 justify-content-between align-items-center">
            <Link
              to={"/Dashboard/Home"}
              className=" d-flex align-items-center text-decoration-none color text-white lin  fs-2 gap-2" >
              <AiFillHome className="" />
            </Link>
            <Link
              to={"/dashboard/Network"}
              className="d-flex align-items-center  text-decoration-none color text-white lin  fs-2 gap-2"
            >
              <FaPeopleRobbery />
            </Link>

            <Link
              to={"/chats"}
              className="d-flex align-items-center  text-decoration-none color text-white lin  fs-2 gap-2"
            >
              <BiSolidMessageRoundedDots />
            </Link>
            <Link
              to={"/notifications"}
              className="d-flex align-items-center  text-decoration-none  lin text-white   fs-2 gap-2"
            >
              <IoMdNotifications />
            </Link>
  
          </div>
        </main> */}
      </section>
      <ToastContainer />
    </>
  );
};

export default Home;
