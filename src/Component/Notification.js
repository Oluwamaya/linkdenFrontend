import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

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
   console.log(value);
   axios.post("http://localhost:4345/users/acceptFriend", {value}
   ).then((res)=>{
     console.log(res);
   }).catch((error)=>{
     console.log(error);
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

  return (
    <>
      <main className='container-fluid p-2'>
        <div className='bg-dark text-light px-2'>
          <div>
            <h4>Notifications</h4>
          </div>
          <div>
            {notifications &&
              notifications.map((el, i) => (
                <div className="border-bottom d-flex justify-content-between align-items-center" key={i}>
                  <p className="fw-bold fs-6">{capitalizeFirstLetter(el.message)}</p>
                  {el.message.includes("sent you a friend request") ? (
                    <div className="p-2">
                      <button className="btn btn-success" onClick={() => acceptFriend(el, i)}>
                        Accept
                      </button>
                      <button className="btn btn-info mx-2" onClick={() => RejectFriend(el, i)}>
                        Reject
                      </button>
                    </div>
                  ) : null }
                </div>
               )) 
                  }</div>
          </div>
      </main>
      <ToastContainer />
    </>
  );
};

export default Notification;
