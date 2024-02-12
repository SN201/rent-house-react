
import { getAuth, updateProfile } from 'firebase/auth';
import {db} from '../firebase.config'
import React , {useState , useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { collection, deleteDoc, doc , getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { FcHome } from "react-icons/fc";
import ListingItem from '../components/ListingItem';
const Profile = () => {
const auth = getAuth();
const navigate = useNavigate();
const [listings, setListings] = useState(null)
const [loading , setLoading] = useState(true);
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
async function onDelete(listingID){
  if(window.confirm("Are you sure you want to delete ?")){
    await deleteDoc(doc(db, "listings", listingID))
    const updatedListing = listings.filter(
      (listing)=> listing.id !== listingID
    );
    setListings(updatedListing);
    toast.success(" deleted successfully !")
  }
}
function onEdit(listingID) {
  navigate(`/edite-listing/${listingID}`)
}
useEffect(() =>{
  async function  fetchUserListing(){
      const listingsRef = collection(db, "listings");
      const q = query(
       listingsRef,
       where("userRef" , "==",auth.currentUser.uid),
       orderBy("timestamp", "desc")
       );
       const querySnap = await getDocs(q);
       let listings = [];
       querySnap.forEach((doc)=>{
          return listings.push({
              id:doc.id , 
              data : doc.data(),
          });
       });
       setListings(listings)
      setLoading(false);

  }
  fetchUserListing();
  },[auth.currentUser.uid])
  return (
    <>
    <section className='max-w-6xl mx-auto flex justify-center items-center flex-col'>
      <h2 className='text-3xl font-bold mt-6 mb-6 text-center'>My Profile</h2>
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
        <button type='submit' className='w-full bg-blue-600 text-white uppercase px-7 py-3 text-sm
          font-medium rounded shadow-md hover:bg-blue-700  transition duration-150  ease-in-out hover:shadow-lg active:bg-blue-800'>
          <Link to="/create-listing" className='flex justify-center items-center'>
        < FcHome className='mr-2 text-3xl bg-red-200 rounded-full p-1 border-2'/> 
         Sell or rent your home
         </Link>
        </button>
      </div>
    </section>
    <div className='max-w-6xl px-3 mt-6 mx-auto'>
      {!loading&& listings && listings.length > 0 && (
        <>
        <h1 className='text-3xl text-center font-semibold'>My Listing</h1>
        <ul className='sm:grid sm:grid-cols-2 
        lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5
        mt-6 mb-6'> 
          {listings.map((listing) =>(
            <ListingItem 
            key={listing.id}
            id={listing.id}
            listing={listing.data}
            onDelete = {()=>onDelete(listing.id)}
            onEdit = {()=>onEdit(listing.id)}
            />
          ))}
        </ul>
        </>
      )}
    </div>
    
    </>
  )
}

export default Profile
