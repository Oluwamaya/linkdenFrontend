import React, {useState} from 'react'
import 'bootstrap/dist/js/bootstrap.bundle.min'
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { useFormik } from 'formik';
import * as yup from 'yup'


const ForgotPass = () => {
    const navigate = useNavigate()
const [email, setemail] = useState("")
const [OTP, setOTP] = useState()
// const [password, setpassword] = useState("")
const [second, setsecond] = useState(false)
const [first, setfirst] = useState(true)
const [third, setthird] = useState(false)
const [saveOTP, setsaveOTP] = useState("")
const [flop, setflop] = useState('')




const handlesubmit = ()=>{
    console.log(email)
    axios.post("http://localhost:4345/users/forgetP", {email})
    .then((res) =>{
        console.log(res)
       setsaveOTP(res.data.OTP)
        setsecond(!second)
        setfirst(!first)
    }).catch((error)=>{
        console.log(error)
        alert(error.response.data.message)
    })
}


function handleOTP() {
    console.log(saveOTP)
    console.log(OTP)
    console.log(email)

   if(saveOTP === OTP){
    setsecond(!second)
    setthird(!third)
    axios.post("http://localhost:4345/users/verifyPass",{OTP, email}).then((res)=>{
        console.log(res)
    }).catch((error)=>{
        console.log(error)
    })
   }else{
    alert("Incorrect OTP check your mailbox")
   } 
}

function firstCancel() {
    navigate("/sign")
}

function secondCancel() {
    alert("kisk")
    setfirst(!first)
    setsecond(!second)
}

const formik = useFormik({
    initialValues:{
        password:"",
        confirmpass:""
    },
    validationSchema:yup.object({
        password:yup.string().min(7,"Password is too short min of 7").required("password cannot be empty"),
        confirmpass: yup.string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required')
    }),
     onSubmit: async(value)=>{
        console.log(value);
        console.log(value.password)
        const {password} = value
        console.log(password)
        // setpassword(value.password)
        // console.log(password)
       console.log( email,OTP)
        await  axios.post("http://localhost:4345/users/resetPass",{password,OTP,email})
            .then((res)=>{
                console.log(res)
                alert(res.data.message)
                navigate("/sign")
            }).catch((error)=>{
                console.log(error)
            })
        }
    
})
  return (
    <>
      <main className='container mt-5 ' >
        { first&&
         <div className='col-8 col-md-4 bg-light border p-2 mx-auto text-center'>
            <h3 className='my-2 fw-bold lead'>Find your account</h3><hr />
            <div className='my-2'>
            <p className='h6'>Please enter your email to search for your account.</p>
             <input className='form-control' type="email" placeholder='Email address here' onChange={(e)=>{setemail(e.target.value)}}/>
            </div><hr />
            <div className='text-end px-2'>
             <button onClick={firstCancel} className='btn btn-secondary '>Cancel</button>
            <button onClick={handlesubmit} className='btn btn-primary ms-2'> Search</button>
            </div>

         </div>}

        {second&& 

        <section  className='col-7 bg-dark text-light p-2 text-center m-auto my-4'>
            <h5>Please Input your OTP here</h5><hr />
            <div>

            <p>check your mailbox to get the OTP </p>
            <input type="text" className='form-control' placeholder='OTP' onChange={(e)=>setOTP(e.target.value)} />
            </div><hr />
            <div className='text-end px-2'>
             <button onClick={secondCancel} className='btn btn-secondary '>Back</button>
            <button onClick={handleOTP} className='btn btn-primary ms-2'> Enter</button>
            </div>
         </section>
            }

            {third&&
                <section>
                    <main className='col-10 col-md-8 bg-dark text-light p-3 text-center mx-auto'>
                        <form onSubmit={formik.handleSubmit}>
                            <div>
                          <input type="text" onChange={formik.handleChange} name='password' onBlur={formik.handleBlur}
                            className={formik.touched.password && formik.errors.password ? "form-control is-invalid" : "form-control"} placeholder='password' /> 
                          <p className='text-danger h6 fw-bold'>{formik.touched.password && formik.errors.password}</p>

                          </div>
                            <div className='my-2'>
                          <input type="text"  onChange={formik.handleChange} name='confirmpass' onBlur={formik.handleBlur}
                           className={formik.touched.confirmpass && formik.errors.confirmpass ? "form-control is-invalid" : "form-control"} placeholder='cpassword' /> 
                          <p className="text-danger h6 fw-bold">{formik.touched.confirmpass && formik.errors.confirmpass}</p>
                           </div>
                          <div>
                            <button type='submit' className='btn btn-light my-2'> Enter</button>
                          </div>
                          
                        </form>
                    </main>
                </section>
            }
         
      </main>
    </>
  )
}

export default ForgotPass