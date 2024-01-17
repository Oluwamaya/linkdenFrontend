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
        
          <main className=' frok bg-danger w-100'>    
            <nav> 
              
              
            
            </nav>
              <Outlet/>
          </main>
                  <ToastContainer />        
    </>
  )
}

export default Dashboard