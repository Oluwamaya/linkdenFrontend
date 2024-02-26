import React, { useState, useEffect } from "react";
import { AiFillHome } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";
import { BiSolidMessageRoundedDots } from "react-icons/bi";
import { IoMdNotifications } from "react-icons/io";
import { FaPeopleRobbery } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Style folder/Home.css";
import { Link, Outlet } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import _debounce from "lodash/debounce";
import { fetchingfriends, fetchedFriends, fetchingError } from "../Redux/Slice";
import { isFetchingUser, fetchedUser } from "../Redux/Userslice";
import { useDispatch, useSelector } from "react-redux";
import { FaBars } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";


const Dashboard = () => {
  const { isAdding, added, addingError } = useSelector(
    (state) => state.findUser
  );
  const dispatch = useDispatch();

  const [showmeall, setshowmeall] = useState(false);
  const [close, setclose] = useState(false);
  const navigate = useNavigate();
  const [message, setmessage] = useState("");
  const token = localStorage.getItem("Ln Token");
  // console.log(token)

  useEffect(() => {
    axios
      .get("https://lnbackend.onrender.com/users/verify", {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      .then((res) => {
        // console.log(res.data.message)
        dispatch(fetchedUser(res.data.user))
        setmessage(res.data.user);
        // console.log(res.data.user)
      })
      .catch((error) => {
        if (
          error.response.data.message ===
          "Operation `signups.findOne()` buffering timed out after 10000ms"
        ) {
          toast(error.response.statusText);
        } else {
          console.log(error);
          toast(error.response.data.message);
          navigate("/sign");
        }
      });
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const finder = async (query) => {
    console.log(query);
    try {
      axios
        .get("https://lnbackend.onrender.com/users/getUsers", { params: { query } })
        .then((res) => {
          console.log(res.data);
          setSearchResults(res.data);
          dispatch(fetchedFriends(res.data));
        })
        .catch((error) => {
          console.log(error);
          dispatch(fetchingError(error));
        });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // Introduce a small delay before making the request to prevent too many requests in a short time
    const timeoutId = setTimeout(() => {
      finder(searchQuery);
    }, 300);

    // Clear the timeout on each input change to avoid multiple requests firing
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const debouncedFinder = _debounce(finder, 300);

  const handleSearchChange = (e) => {
    setshowmeall(!showmeall)
    const query = e.target.value;
    setSearchQuery(query.trim());

    // Check if the query is not empty before triggering the debounced search
    if (query.trim() !== "") {
      debouncedFinder(query.trim());
    } else {
      // Handle the case when the input is empty, e.g., reset the search results
      setSearchResults([]);
    }
  };
  function networkPage({ user }) {
    console.log(user);
    const id = user.email;
    console.log(id);
    navigate(`/network/${id}`);
  }

  function showme() {
    setshowmeall(true);
  }
  function dntshow() {
    setshowmeall(false);
    // alert("king")
  }
  function opened() {
    setclose(true);
  }
  function closee() {
    setclose(false);
  }

  const capitalizeFirstLetter = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };
  function displayme(){
    alert("djdjj")
   
  }



  return (
    <>
      <main className=" frok bg-danger w-100">
        <nav className=" align-items-center justify-content-around bg-light shad12">
          <div className="d-flex align-items-center">
            <div>         
            <img
              src={require("../image/news.jpg")}
              className="log img-fluid "
              alt="icon"
            />
            </div>
            <main className="drop2">
              <div className="few ">
                {/* <div onMous></div> */}
                <p className="mt-2 text-muted">
                  <FaSearch />
                </p>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e)=>handleSearchChange(e)}
                  // onChange={displayme}
                  placeholder=" Search "
                  className="search"
                />
              </div>
              <div className="down2">
                {showmeall &&
                  <div className=" text-dark  saes py-2 ms-2">
                    <div>
                      <ul>
                        <div className="d-flex align-items-center ">
                          <h5 className="fw-bold">Recent search</h5>
                          {/* <button className='rounded-circle py-1 px-2 mx-2  border-0'  onClick={dntshow}>X</button> */}
                        </div>
                        {Array.isArray(searchResults) &&
                          added.map((userInfo) => (
                            <div key={userInfo._id}>
                              <li
                                onClick={() => networkPage({ user: userInfo })}
                              >
                                {capitalizeFirstLetter(userInfo.username)}
                              </li>
                            </div>
                          ))}
                      </ul>
                    </div>
                  </div> 
                }
              </div>
            </main>
          </div>
          <div className="d-flex pt-1 justify-content-between  align-items-center w-75">
            <Link
              to={"/Dashboard/Home"}
              className=" d-flex align-items-center flex-column text-decoration-none color lin "
            >
              <AiFillHome />
              Home
            </Link>
            <Link
              to={"/dashboard/Network"}
              className="d-flex align-items-center flex-column text-decoration-none color lin "
            >
              <FaPeopleRobbery />
              My Network
            </Link>

            <Link
              to={"/chats"}
              className="d-flex align-items-center flex-column text-decoration-none color lin "
            >
              <BiSolidMessageRoundedDots />
              Messaging
            </Link>
            <Link
              to={"/notifications"}
              className="d-flex align-items-center flex-column text-decoration-none  lin "
            >
              <IoMdNotifications />
              Notification
            </Link>
            <Link to={"/user"}>
              <img
                src={message.profilePic}
                className="rounded rounded-5 me-5 img-fluid bluh"
                alt=""
                srcset=""
              />
              {/* <img className='text-black bg-secondary rounded-circle text-light p-2 h5 fw-bolder'>{message && message.username}</> */}
            </Link>

            {/* </main> */}
          </div>
        </nav>

        <main className="posi">
          <nav className=" justify-content-between align-items-center bg-light kinl position-relative w-100 p-2 mt-5">
            <div className="d-flex align-items-center">
            <div>         
            <img
              src={require("../image/news.jpg")}
              className="log img-fluid "
              alt="icon"
            />
            </div>
              <main className="drop2">
                <div className="few ">
                  {/* <div onMous></div> */}
                  <p className="mt-2 text-muted">
                    <FaSearch />
                  </p>
                  <input
                    type="search"
                    value={searchQuery}
                    onInput={handleSearchChange}
                    placeholder=" Search "
                    className="search"
                  />
                </div>
                <div className="down2">
                  {showmeall && 
                    <div className=" text-dark py-2">
                      <div>
                        <ul>
                          <div className="d-flex align-items-center ">
                            <h5 className="fw-bold">Recent search</h5>
                            {/* <button className='rounded-circle py-1 px-2 mx-2  border-0'  onClick={dntshow}>X</button> */}
                          </div>
                          {Array.isArray(searchResults) &&
                            added.map((userInfo) => (
                              <div key={userInfo._id}>
                                <li
                                  onClick={() =>
                                    networkPage({ user: userInfo })
                                  }
                                >
                                  {capitalizeFirstLetter(userInfo.username)}
                                </li>
                              </div>
                            ))}
                        </ul>
                      </div>
                    </div>
                  }
                </div>
              </main>
            </div>
            <main className="drop1 ">
              <div className="">
                {close ? (
                  <button onClick={closee}>
                    <IoCloseSharp className="klori" />
                  </button>
                ) : (
                  <button className="bgb" onClick={opened}>
                    <FaBars className="klori" />{" "}
                  </button>
                )}
                {close ? (
                  <div className="down1  px-2">
                    <div className="gengi">
                      <Link
                        to={"/Dashboard/Home"}
                        className=" d-flex align-items-center  gap-2 h5 fw-bold text-decoration-none color lin "
                      >
                        <AiFillHome />
                        Home
                      </Link>
                    </div>
                    <div className="gengi">
                      <Link
                        to={"/dashboard/Network"}
                        className="d-flex align-items-center  gap-2 h5 fw-bold text-decoration-none color lin "
                      >
                        <FaPeopleRobbery />
                        My Network
                      </Link>
                    </div>
                    <div className="gengi">
                      <Link
                        to={"/chats"}
                        className="d-flex align-items-center  gap-2 h5 fw-bold  text-decoration-none color lin "
                      >
                        <BiSolidMessageRoundedDots />
                        Messaging
                      </Link>
                    </div>
                    <div className="gengi">
                      <Link
                        to={"/notifications"}
                        className="d-flex align-items-center text-decoration-none  gap-2 h5 fw-bold lin "
                      >
                        <IoMdNotifications className="" />
                        Notification
                      </Link>
                    </div>
                    <div className="gengi">
                      <Link
                        className="d-flex align-items-center text-decoration-none  gap-2 h5 fw-bold lin "
                        to={"/user"}
                      >
                        <FaUserCircle />
                        Profile
                      </Link>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </main>
          </nav>
        </main>
        {/* <div>
          <p>lor</p>
        </div> */}
      
        <Outlet />
      </main>
      <ToastContainer />
    </>
  );
};

export default Dashboard;
