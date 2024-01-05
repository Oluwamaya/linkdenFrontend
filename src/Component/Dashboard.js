import React,{useState,useEffect} from 'react'
import {AiFillHome } from 'react-icons/ai'
import {FaSearch, FaBusinessTime} from 'react-icons/fa'
import {BiSolidMessageRoundedDots} from 'react-icons/bi'
import {IoMdNotifications} from 'react-icons/io'
import {FaPeopleRobbery} from 'react-icons/fa6'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Style folder/Home.css'
import { Link, Outlet } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import _debounce from 'lodash/debounce';
import { fetchingfriends, fetchedFriends, fetchingError } from '../Redux/Slice'
import { useDispatch, useSelector } from 'react-redux'




const Dashboard = () => {
 const {isAdding , added ,addingError} = useSelector((state)=>state.findUser)
//  console.log(added)
//  console.log(isAdding)

 const dispatch = useDispatch()


const [showmeall, setshowmeall] = useState(false)
  
  const navigate = useNavigate()
  const [message, setmessage] = useState('')
  const token = localStorage.getItem("Ln Token")
  // console.log(token)
  useEffect(() => {
    axios.get("http://localhost:4345/users/verify",{
      headers:{
        Authorization: `bearer ${token}`
      }
    }).then((res)=>{
        // console.log(res.data.message)
        setmessage(res.data.user)
        // console.log(res.data.user)
      })
      .catch((error)=>{
        if (error.response.data.message === 'Operation `signups.findOne()` buffering timed out after 10000ms') {
          toast(error.response.statusText)
        }else{
        console.log(error);
        toast(error.response.data.message)
        navigate("/sign")
        }
        
      })
      
    }, [])
    
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    
    const finder = async (query) => {
      console.log(query)
      try {
        axios.get("http://localhost:4345/users/getUsers", 
        {params:{query}
      }).then((res)=>{
        console.log(res.data)
        setSearchResults(res.data)
        dispatch(fetchedFriends(res.data))
      }).catch((error)=>{
        console.log(error)
        dispatch(fetchingError(error))
      })
        
      } catch (error) {
        console.error('Error fetching data:', error);
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
    function networkPage({user}) {
      console.log(user)
      const id = user.email
      console.log(id)
  navigate(`/network/${id}`);
      
    }

    function showme(){
    
    setshowmeall(true)
  
    }
    function dntshow() {
      setshowmeall(false)
      // alert("king")
    }

    const capitalizeFirstLetter = (word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    };
  
  
  return (
    <>
        
          <header className='container-fluid' onClick={dntshow}>
              <main  className='d-flex justify-content-around  align-items-center position-fixed top-0 end-0 start-0  bg-light '>
                <div className='d-flex align-items-center '>
                <img src={require("../image/logo.png")} className='log img-fluid ' alt="icon" />
                <div className='  '> 

                <div onMouseOver={showme} className='few '>
                  {/* <div onMous></div> */}
                  <p className='mt-2 text-muted'><FaSearch /></p>
                  <input type="search" value={searchQuery}  onInput={handleSearchChange} placeholder=" Search " className='search'/>
                </div>
               
                </div>
                </div>
                

                <div className='d-flex pt-1 justify-content-between  align-items-center w-75'>

                  <Link to={'/Dashboard/Home'} className=' d-flex align-items-center flex-column text-decoration-none color lin '>
                  <AiFillHome/>
                  Home
                  </ Link>
                  <Link to={'/dashboard/Network'} className='d-flex align-items-center flex-column text-decoration-none color lin '>
                  <FaPeopleRobbery/>
                  My Network
                  </Link>
                

                  <Link to={'/chats'} className='d-flex align-items-center flex-column text-decoration-none color lin '>
                  <BiSolidMessageRoundedDots/>
                  Messaging
                  </Link>
                  <Link to={'/notifications'} className='d-flex align-items-center flex-column text-decoration-none  lin '><IoMdNotifications/>
                  Notification
                  </Link>
                  <Link to={'/user'}>
                  <p className='text-black bg-secondary rounded-circle text-light p-2 h5 fw-bolder'>{message && message.username[0].toUpperCase()}</p>
                  </Link>
                  
                </div>
                
              </main>
              {showmeall && <div className=' border text-light position-fixed   bg-dark py-2'>
                  <div >
                    <ul>
                      <div className='d-flex align-items-center '>

                      <h5>Recent search</h5>
                      {/* <button className='rounded-circle py-1 px-2 mx-2  border-0'  onClick={dntshow}>X</button> */}
                      </div>
        {Array.isArray(searchResults) &&
        added.map((userInfo) => (
          <div key={userInfo._id}>

          <li onClick={() => networkPage({ user: userInfo })}>{capitalizeFirstLetter(userInfo.username)}</li>
        
          </div>
        ))}
        </ul>
        </div>
                </div>}
          </header>
                  <Outlet/>
                  <ToastContainer />        
    </>
  )
}

export default Dashboard