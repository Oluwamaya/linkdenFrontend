import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
    const navigate = useNavigate()
     const goback = ()=>{
        navigate("/dashboard/home")
     }
  return (
    <>
      <main className='container mt-5'>
        <div className='col-8 bg-light text-dark text-center mt-5 shadow-lg '>
            <h3 className='fw-bold'>Page Not Found</h3>
            <p className='fw-bold'>Uh oh, we can’t seem to find the page you’re looking for. Try going back to the previous page or see our Help Center for more information</p>
            <button onClick={goback} className='btn btn-dark '>Go back</button>
        </div>
      </main>
    </>
  )
}

export default NotFound