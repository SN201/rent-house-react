import React , {useState} from 'react'
import { Link , useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import OAuth from '../components/OAuth';
import { getAuth ,createUserWithEmailAndPassword , updateProfile   } from "firebase/auth";
import {db} from '../firebase.config'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import {toast} from 'react-toastify'
const SignUp = () => {
  const [showPassword,setShowPassword] = useState(false);
  const [formData , setFormData] =useState({name:"",email : "", password :"" });
  const {name,email, password , phone} = formData;
  const  navigate = useNavigate();
  function onchange(e){
    setFormData((prevState)=>({
      ...prevState , [e.target.id] : e.target.value
    }))
  }
  async function onSubmit(e){
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword (
        auth
        ,email
        , password);
        updateProfile(auth.currentUser,{
          displayName : name
        })
      const user = userCredential.user;
      const formDataCopy = {...formData};
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();
      await setDoc(doc(db, "users" , user.uid) , formDataCopy)
      // toast.success("Sigin Up Done successfully !")
      navigate("/");
    } catch (error) {
      toast.error("Something went wrong with Registration ! ")

    }
  }
  return (
    <section>
      <h1 className='text-3xl text-center font-bold '
      > Sign Up</h1>
      <div className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl m-auto '>
        <div className='md:w-[67%] lg:w-[50%] md:mb-6'>
          <img 
          src='https://images.unsplash.com/flagged/photo-1564767609342-620cb19b2357?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8a2V5fGVufDB8fDB8fHww' 
          alt='key'
          className='w-full rounded-2xl'/>
        </div>
        <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20 mt-6'>
          <form onSubmit={onSubmit}>
          <input type='text' id='name' value={name} placeholder='Full Name' onChange={onchange}
          className='w-full px-4 py-2 text-xl text-gray-700 bg-white border
           border-gray-300 rounded transition ease-in-out mb-6'/>

          <input type='email' id='email' value={email} placeholder='Email address' onChange={onchange}
          className='w-full px-4 py-2 text-xl text-gray-700 bg-white border
           border-gray-300 rounded transition ease-in-out mb-6'/>
           
           <div className='relative mb-6'>
           <input type={showPassword ? `text` : `password`} id='password' value={password} placeholder='Password' onChange={onchange} 
          className='w-full px-4 py-2 text-xl text-gray-700 bg-white border
           border-gray-300 rounded transition ease-in-out '/>
           {showPassword ? <VisibilityIcon  className='absolute right-3 top-3 cursor-pointer'onClick={()=>setShowPassword((prevState)=>!prevState)} /> :
            <VisibilityOffIcon className='absolute right-3 top-3 cursor-pointer' onClick={()=>setShowPassword((prevState)=>!prevState)}/>}
           </div>
           <div className=' flex justify-between whitespace-nowrap text-sm sm:text-lg'>
            <p className='mb-6'>
              Have account ? <Link to="/sig-in" className='text-red-500 hover:text-red-700 transition duration-150 ease-in-out ml-1'>sign-in</Link>
            </p>
            <Link to="/forgot-password" className='text-blue-500 hover:text-blue-700 transition duration-150 ease-in-out '>Forgot Password</Link>
           </div>
           <button type='submit' className='w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium rounded shadow-md
           hover:bg-blue-700  transition ease-in-out
           active:bg-blue-800 ' >Sign Up</button>
            <div className='my-4 before:border-t before:border-gray-300 before:border  flex before:flex-1 items-center
            after:border-t after:border-gray-300 after:border  after:flex-1'>
        <p className='text-center  font-semibold mx-4' >OR</p>
        </div>
        <OAuth/>
          </form>
        </div>
       
      </div>
    </section>
  )
}



export default SignUp
