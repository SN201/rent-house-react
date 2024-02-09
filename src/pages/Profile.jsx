
import { getAuth, updateProfile } from 'firebase/auth';
import {db} from '../firebase.config'
import React , {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { doc , updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
const Profile = () => {
const auth = getAuth();
const navigate = useNavigate();
const [changeDetail , setChangeDetail] = useState(false)
const [formData , setFormData] = useState({
  name : auth.currentUser.displayName , 
  email: auth.currentUser.email
})
const {name ,email} =  formData
function onLogout (){
  auth.signOut();
  navigate("/")
}
function onChange(e){
  setFormData((prevState)=>({
    ...prevState , [e.target.id] : e.target.value
  }))

}
 async function onSubmit(){
try {
  //when change done submite the the change name 
  if(auth.currentUser.displayName != name ){
    //update the display name in firbase 
    await updateProfile(auth.currentUser , {
      displayName: name
    });
    // update the name in firestore 
    const docRef = doc(db , "users" , auth.currentUser.uid)
    await updateDoc(docRef , {
      name: name
    });
  }
  toast.success("Profile detail updated successfully")
  
} catch (error) {
  toast.error("Could not update profile details")
}
}
  return (
    <section className='max-w-6xl mx-auto flex justify-center items-center flex-col'>
      <h1 className='text-3xl font-bold mt-6 text-center'>My Profile</h1>
      <div className='w-full md:w-[50%] mt-6 px-3'>
        <form>
          <input type="text"
           id="name" 
           value={name}
            onChange={onChange}  
            disabled={!changeDetail} 
            className={` w-full px-4 py-2 text-xl
             text-gray-700 bg-white border
           border-gray-300 rounded transition ease-in-out mb-6 ${changeDetail && "bg-red-200 focus:bg-red-200"}`} />

          <input type="email"
           id="email" 
           value={email} 
           onChange={onChange} 
           disabled={!changeDetail}
           className={`w-full px-4 py-2 text-xl
           text-gray-700 bg-white border
           border-gray-300 rounded transition ease-in-out mb-6 ${changeDetail && "bg-red-200 focus:bg-red-200"}`} />
           <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg '>
            <p className='flex items-center'>
              Do you want to change your name ? 
              <span className='text-red-600 hover:text-red-700 transition ease-in-out duration-200 ml-1 cursor-pointer'
               onClick={()=>{ 
                changeDetail && onSubmit();
                setChangeDetail((prevState)=>!prevState);}}
                >{changeDetail ? "Apply changes" : "Edit" }
                </span>
            </p>
            <p onClick={onLogout} className='text-blue-600 hover:text-blue-700  transition ease-in-out duration-200 ml-1 cursor-pointer'>Sgin-Out</p>
           </div>
        </form>
      </div>
    </section>
  )
}

export default Profile
