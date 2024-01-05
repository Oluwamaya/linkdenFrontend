import React, {useState, useEffect} from 'react'
import axios from 'axios'

const Button = () => {
  const [caption, setcaption] = useState("")
  const [file, setfile] = useState("")
  const [display, setdisplay] = useState([])
  const token = localStorage.getItem("Ln Token")
  useEffect(() => {
    axios.get("http://localhost:4345/users/getpost",{
      headers:{
        Authorization: `bearer ${token}`
      }
    })
   .then((res)=>{
      console.log(res.data.getpost)
      setdisplay(res.data.getpost)
      console.log(display)
    }).catch((error) =>{
      console.log(error)
    })
  }, [display])

  useEffect(() => {
     console.log(display);
  }, [display])
  

   let result;
  const handleChange = (e)=>{
    const file =  e.target.files[0]
   const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload =(e)=>{
        result = reader.result
        console.log(result)
        setfile(result)
    }
  }
  
    
    
    
  

  const handleSubmit  =(e)=>{
   
    console.log(token);
    e.preventDefault()
   axios.post("http://localhost:4345/users/posts",{file, caption},{
    headers:{
     Authorization: `bearer ${token}`
     }
    }
    ).then((res)=>{
     console.log(res.data)
    
   }).catch((error)=>{
    console.log(error)
    alert(error.response.data.message)
   })
  
 
  
  }  
  return (
    <>
      <div>
        <form action="" onSubmit={handleSubmit}>
           <div>
            <input type="text" onChange={(e)=> setcaption(e.target.value)} name='caption' />
           </div>
          
          <div>
            <input type="file" name=""  onChange={handleChange} id="" />
          </div>
          <button type='submit'>Post</button>
          {display &&
          display.map((el, i)=>(
            <div key={i}>
               <main>
                <div>
                  <h3>{el.author.username}</h3>
                </div>

                <div>
                  <h5>{el.caption}</h5>
                  <img src={el.image} alt="" srcset="" />
                </div>

                <div>
                  <button >like</button>
                  <button>Comment</button>
                </div>
               </main>
            </div>
          ))

          }

          

        </form>
      </div>
    </>
  )
}

export default Button