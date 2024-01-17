import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { IoIosArrowRoundBack } from "react-icons/io";
import axios from 'axios';
import {ToastContainer ,toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as yup from 'yup'


const Review = () => {
    const navigate = useNavigate()
    const [name, setname] = useState("")
    const [textarea, settextarea] = useState("")
    const [info, setinfo] = useState({})

    const token = localStorage.getItem("Ln Token")

    useEffect(() => {
        axios.get("http://localhost:4345/users/verify",{
          headers:{
            Authorization: `bearer ${token}`
          }
        }).then((res)=>{
            console.log(res.data.message)
            setinfo(res.data.user)
            console.log(res.data.user)
          })
          .catch((error)=>{
            console.log(error);
            alert(error.response.data.message)
            navigate("/sign")
            
            
          })
          
        }, [])

        const formik = useFormik({
            initialValues: {
                name:'',
                textarea: ""
    
            },
            validationSchema:yup.object({
                name:yup.string().required("Name cannot be empty").min(3,"minimum of 3 characters"),
                textarea:yup.string().required("Input your Opinion")
            }),
	 onSubmit: async(value)=>{
            
        
     if(value){
       const {name, textarea} = value
              
        const values = {
            senderEmail: info.email,
            name: name,
            message : textarea 
        }
        console.log(values);
        await axios.post("http://localhost:4345/users/Review", values
        ).then((res)=>{
            console.log(res);
            toast(res.data.message)
            navigate("/user")
        }).catch((error)=>{
            console.log(error);
        })
    }
}
})
     function goBack(){
        navigate("/user")
       }
  return (
    <>
      <section className='container  bg-dark text-light foki'>
        <div className='position-fixed end-0 '>
        <button className='btn btn-light  'onClick={goBack}><IoIosArrowRoundBack  className='fs-1'/> </button>
      </div>
      <div>
  <form onSubmit={formik.handleSubmit} className='form-group border border-1 pt-5 px-2'>
    <div className="mb-3 ">
      <label htmlFor="inputText" className="form-label">Name:</label>
      <input type="text" name='name' className={formik.touched.name && formik.errors.name ? 'form-control is-invalid' : 'form-control is-valid'} onChange={formik.handleChange} onBlur={formik.handleBlur} id="inputText"  />
      <p className='text-danger'>{formik.touched.name && formik.errors.name}</p>
    </div>
    <div className="mb-3">
      <label htmlFor="textarea" className="form-label">Message:</label>
      <textarea className={formik.touched.textarea && formik.errors.textarea ? 'form-control is-invalid' : 'form-control '} name='textarea' onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder='What would you like to share❔' id="textarea" rows="5" ></textarea>
      <p className='text-danger'>{formik.touched.textarea && formik.errors.textarea}</p>   
    </div>
    <div className='text-center m-auto my-3'>
    <button className="mybut" type='submit'> Submit </button>
</div>
  </form>
  </div>
</section>
  <ToastContainer />

    </>
  )
}

export default Review