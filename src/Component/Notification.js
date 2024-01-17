import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { RiArrowGoBackLine } from "react-icons/ri";

const Notification = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [userinfo, setuserinfo] = useState({})
  const [fetchEmail, setFetchEmail] = useState("");
  const token = localStorage.getItem('Ln Token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4345/users/verify", {
          headers: {
            Authorization: `bearer ${token}`
          }
        });

        setFetchEmail(response.data.user.email);
        setuserinfo(response.data.user)
        console.log(userinfo._id);
        console.log(response.data);
      } catch (error) {
        console.log(error);
        if (error.response.data.message === 'Operation `signups.findOne()` buffering timed out after 10000ms') {
          toast(error.response.statusText);
          navigate("/sign");
        } else {
          toast(error.response.data.message);
          navigate("/sign");
        }
      }
    };

    fetchData();
  }, [token, navigate]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.post("http://localhost:4345/users/findNoti", { email: fetchEmail });
        setNotifications(response.data.notifications);
        console.log(response);
      } catch (error) {
        console.log(error);
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
    };
  

    if (fetchEmail) {
      fetchNotifications();
    }
  }, [fetchEmail]);

  const acceptFriend = (el, i)=>{
    console.log(el._id);
    const value = {
      userId: userinfo._id,
       friendemail: el.from,
       notificationId: el._id
   }
   axios.post("http://localhost:4345/users/acceptFriend", {value}
   ).then((res)=>{
     console.log(res);
    //  toast(res.data.message)
    toast.success(res.data.message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light"
    });
      const updatedNotifications = [...notifications];
      updatedNotifications.splice(i, 1);
      setNotifications(updatedNotifications);

   }).catch((error)=>{
     console.log(error);
     toast.error(error, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      });
   })
  }
  function RejectFriend(el, i) {
    const value = {
       userId: userinfo._id,
        friendemail: el.from,
        notificationId: el._id
    }
    console.log(value);
    axios.post("http://localhost:4345/users/rejectFriend", {value}
    ).then((res)=>{
      console.log(res);
      const updatedNotifications = [...notifications];
      updatedNotifications.splice(i, 1);
      setNotifications(updatedNotifications);
    }).catch((error)=>{
      console.log(error);
    })
  }

  const capitalizeFirstLetter = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  function goback(){
    navigate("/dashboard/Home")
  }
  return (
    <>
      <main className='container-fluid p-2'>
        <div className='slow  text-dark px-2 feel'>
          <div className='d-flex  justify-content-between  align-items-center p-2'>
            <h4 className='fw-bold'>Notifications</h4>
            <button className='btn btn-dark ' onClick={goback}><RiArrowGoBackLine /></button>
          </div><hr />
          <div>
            {notifications &&
              notifications.map((el, i) => (
                <div className="border-bottom d-flex justify-content-between align-items-center" key={i}>
                  <p className="fw-bold fs-6">{capitalizeFirstLetter(el.message)}</p>
                  {el.message.includes("sent you a friend request") ? (
                    <div className="p-2 d-flex align-items-center">
                      <button className="btn btn-light" onClick={() => acceptFriend(el, i)}>
                        Accept
                      </button>
                      <button className="btn btn-dark mx-2" onClick={() => RejectFriend(el, i)}>
                        Reject
                      </button>
                    </div>
                  ) : null }
                </div>
               )) 
                  }</div>

                  <div className='d-flex align-items-center bg-dark text-light border border-2  rounded-2  border-info position-fixed bottom-0 end-0 start-0 '>
                    <img src={require("../image/yellow-note-paper-with-red-pin_1284-42430.avif")} className='maya' alt="" srcset="" />
                    <p className=' h6 fw-bold w-100 flow moving-text'>"Explore Notifications Read Your Messages"</p>
                  </div>
          </div>
      </main>
      <ToastContainer />
    </>
  );
};

export default Notification;
