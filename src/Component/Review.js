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
        axios.get("https://lnbackend.onrender.com/users/verify",{
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
        await axios.post("https://lnbackend.onrender.com/users/Review", values
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
      <section className='container-fluid kenno pt-5 text-light  foki'>
        <div className='position-fixed end-0 '>
        <button className='btn btn-light  'onClick={goBack}><IoIosArrowRoundBack  className='fs-1'/> </button>
      </div>
      <div>

  <form onSubmit={formik.handleSubmit} className='form-group col-12 m-auto py-3 col-md-8 border border-1 pt-5 px-2'>
    <div className="mb-3 ">
      <div>
        <p className='text-dark text-center fw-bold h4 border-dark border-bottom border-2'>Contribute to Our Growth – Write a Review</p>
      </div>
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
    {/* <button className="mybut" type='submit'> Submit </button> */}
    <button className='huh' type='submit'>
  <span>Button</span>
</button>
</div>
  </form>
  </div>
</section>
  <ToastContainer />

    </>
  )
}

export default Review