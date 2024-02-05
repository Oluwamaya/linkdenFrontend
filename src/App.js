import React, {  useEffect } from "react";
import { useFormik } from "formik";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  const navigate = useNavigate()
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmpassword: "",
    },
    validationSchema: yup.object({
      username: yup
        .string()
        .min(4, "Username is too short")
        .required("Username cannot be empty"),
      email: yup
        .string()
        .email("Must be a valid email")
        .required("Email cannot be empty"),
      password: yup
        .string()
        .min(5, "password must be a minimum of 5 characters")
        .required("Password cannot be empty")
        .max(10, "Password must be atleast 10 Characters"),
        confirmpassword: yup.string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required')
       }),
    onSubmit: async(value) => {
        console.log(value);
      if (value) {
        await axios
          .post("http://localhost:4345/users/signup", value)
          .then((res) => {
            console.log(res.data.message);
            toast(res.data.message)
             navigate("/sign")
          })
          .catch((error) => {
            console.log(error);
            toast(error.response.data.message)
          });
      } 
        
    },
  });

  function goToLogin(){
    navigate('/sign')
  }
//   console.log(formik.in);
  return (
    <>
      <div className="d-flex justify-content-center align-items-center shawdow drum">
        <form className="form" onSubmit={formik.handleSubmit}>
          <p className="title">Register </p>
          <p className="message">Signup now and get full access to our app. </p>

          <label>
            <input
              required=""
              type="text"
              name="username"
              onChange={formik.handleChange}
              className="input"
              onBlur={formik.handleBlur}
            />
            <span>Username</span>
            <p className="text-danger">
              {formik.touched.username && 
                formik.errors.username}</p>
          </label>

          <label>
            <input
              
              type="email"
              name="email"
              onChange={formik.handleChange}
              className="input"
              onBlur={formik.handleBlur}
              />
            <span>Email</span>
            <p className="text-danger">{formik.touched.email && formik.errors.email}</p>
          </label>

          <label>
            <input
              required=""
              name="password"
              type="password"
              id="password"
              onChange={formik.handleChange}
              className="input "
              onBlur={formik.handleBlur}
              value={formik.values.password}
              
            />
            <span>Password</span>
            <p className="text-danger">{formik.touched.password && formik.errors.password}</p>
          </label>
          <label>
            <input 
            type="password"
             className="input"
             name="confirmpassword"
            
             onChange={formik.handleChange}
             onBlur={formik.handleBlur} 
             />
            <span>Confirm password</span>
            <p className="text-danger">{formik.touched.confirmpassword && formik.errors.confirmpassword}</p>
          </label>
          <button className="btn btn-dark" type="submit">
            Submit
          </button>
          <p className="signin cursor-pointer ">
            Already have an acount ? <span className="text-primary fw-bold cursor-pointer" onClick={goToLogin}>Login</span>
          </p>
        </form>

      <ToastContainer/>
      </div>
    </>
  );
};

export default App;
