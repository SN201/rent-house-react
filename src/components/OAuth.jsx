import React from 'react'
import GoogleIcon from '@mui/icons-material/Google';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { toast } from 'react-toastify';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { useNavigate } from 'react-router-dom';
const OAuth = () => {
  const navigate = useNavigate();
  async function onGoogleClick(){
    try {
      const auth = getAuth();
      const provider  = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const docRef = doc(db,"users" , user.uid);
    //   // Set crossOriginOpenerPolicy attribute to "same-origin"
    // window.crossOriginOpenerPolicy = 'same-origin';
      const docSnap = await getDoc(docRef);
      if(!docSnap.exists()){
        await setDoc(docRef ,{
          name : user.displayName , 
          email : user.email,
          timestamp : serverTimestamp(),
        });}
        navigate("/");
    } catch (error) {
      toast.error("Could not Authorize with Google") ; 
      console.log(error);
     
    }
  }
  return (
    <button type="button" onClick={onGoogleClick} className='w-full flex items-center justify-center bg-red-700
     text-white px-7 py-3 uppercase text-sm font-medium hover:bg-red-800 active:bg-red-900 
     active:shadow-lg hover:shadow-lg transition duration-150 ease-out rounded '>
     Continue with Google  <GoogleIcon className='ml-2 border border-white  rounded-full text-2xl'/>
    </button>
  )
}

export default OAuth
