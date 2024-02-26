import React,{useState} from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useFormik } from 'formik';
import * as yup from 'yup'
import axios from 'axios';
import { FaLongArrowAltRight } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Sign = () => {
	const [showed, setshowed] = useState(true)

	const navigate = useNavigate()
	const formik = useFormik({
		initialValues: {
			email:'',
			password: ""

		},
     validationSchema: yup.object({
        email:yup 
		.string()
		.required("Email cannot be empty")
		.email("Must be a valid email"),

		password:yup 
		.string()
		.min(5, "Password is too short")
		.required("Password cannot be empty")
		.max(10,'maximum of 10')
	 }),
    

	 onSubmit: (value)=>{
    //  console.log(value)
	alert("done")
	 if (value) {
		axios.post("https://lnbackend.onrender.com/users/signin", value)
		.then((res)=>{
			// console.log(res)
			localStorage.setItem("Ln Token", res.data.token)
		        // console.log(res.data.message)
			toast(res.data.message)
			navigate('/dashboard/Home')

		}).catch((error)=>{
			console.log(error)
			toast(`${error.response.data.message} Confirm your email & password`)
		})
	 }else{
		toast('invalid credentials')
	 }
	 }
	})
	
	const signup = ()=>{
		navigate("/")
	}
	
	function showing() {
           showed ? setshowed(false): setshowed(true)
	}

	

  return (
	<>
       <div className='col-8 col-md-4 p-2 m-auto border bg-info rounded mt-5 text-center'>
		<h4 className='fw-bold '>Login Here</h4>
		<form action="" onSubmit={formik.handleSubmit}>
			<div className='form-group'>
				
				<div className='d-flex align-items-center  form-group'>
					<label className='form-label px-2' htmlFor="email">Email: </label>
					<input type="email" 
				name='email'
				id='email'
				className={formik.touched.email && formik.errors.email ? 'form-control is-invalid' : 'form-control '}
				onChange={formik.handleChange}
				onBlur={formik.handleBlur}
				/>
					</div>
				
				<p className='text-danger'>{formik.touched.email && formik.errors.email}</p>
			</div>
            <div>
				
			<div className='d-flex align-items-center  form-group'>
				<label className='form-label pe-2' htmlFor="pass">Password:</label>
				<input type={showed ? "password" : "text"} 
				name='password'
				id='pass'
				className={formik.touched.password && formik.errors.password ? 'form-control is-invalid' : 'form-control '}
				onChange={formik.handleChange}
				onBlur={formik.handleBlur}
				/>
				<button onClick={showing}><i className={showed ? "fa fa-eye" : "fa fa-eye-slash"}></i></button>
				</div>
				<p className='text-danger'>{formik.touched.password && formik.errors.password}</p>
			</div>
			<button className='btn btn-primary' type='submit'>Login</button>
		</form><hr />
		

		<center>OR</center>
		<div>
			<p className='fw-bold lead ' > Create Your Account <button className='btn btn-primary'  onClick={signup}>Here<FaLongArrowAltRight /></button> </p><hr />
			<p>Forgot your password? <Link className='fw-bold' to={'/forgotpass'}>click here</Link></p>
		</div>
	
	   </div>
	   <ToastContainer />
	</>
  )
}

export default Sign