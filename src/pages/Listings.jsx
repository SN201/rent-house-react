import { doc, getDoc } from 'firebase/firestore'
import React, { useEffect  , useState} from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../firebase.config'
import Spinner from '../components/Spinner'
import { Swiper, SwiperSlide } from "swiper/react";
import { FaBed } from "react-icons/fa";
import { FaBath } from "react-icons/fa6";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaSquareParking } from "react-icons/fa6";
import { FaChair } from "react-icons/fa";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Navigation, Pagination,EffectFade , Autoplay  } from 'swiper/modules';
import { FaShare } from "react-icons/fa";
import { getAuth } from 'firebase/auth'
import Contact from '../components/Contact'
const Listings = () => {
  
    const params=  useParams()
    const [listing , setListing] = useState(null) 
    const [loading , setLoading] = useState(true) 
    const [sharirLinkCopied, setSharirLinkCopied] = useState(false)
    const [contactLandlord ,setContactLandlord]  =useState(false)  
    const auth = getAuth();
    useEffect(()=>{
        async function fetchListing(){
            const docRef = doc(db , "listings" , params.listingID);
            const docSnap =await getDoc(docRef)
            if(docSnap.exists()) {
                setListing(docSnap.data());
                setLoading(false);
            }
          
        }
        fetchListing();
       
    },[params.listingID ])
    if(loading){
        return <Spinner/>
    }
  return (
    <main>
        <Swiper
        slidesPerView={1}
        navigation
        pagination={{ type: "progressbar" }}
        effect="fade"
        modules={[EffectFade , Autoplay , Pagination ,Navigation ]}
        autoplay={{ delay: 3000  ,disableOnInteraction: false}}
      >
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative w-full overflow-hidden h-[300px]"
              style={{
                background: `url(${listing.imgUrls[index]}) center no-repeat`,
                backgroundSize: "cover",
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className='fixed top-[13%] right-[3%] z-10
       bg-white cursor-pointer border-2 border-gray-400
       rounded-full w-12 h-12  flex justify-center items-center  '
       onClick={()=>{
        navigator.clipboard.writeText(window.location.href)
        setSharirLinkCopied(true) ; 
        setTimeout(()=>{
          setSharirLinkCopied(false);
        } , 2000) ;
       }}
       >
      <FaShare className='text-lg text-slate-500' />
      </div>
      {sharirLinkCopied && (
        <p className='fixed top-[23%] right-[5%] z-10 font-semibold border-2
         border-gray-200 rounded-md bg-white p-1'>Linke Copied</p>
      )}
      <div className=' flex flex-col md:flex-row m-4 max-w-6xl
       lg:m-auto p-4 rounded-lg lg:space-x-4 shadow-lg bg-white '>
        <div className='  w-full '>
        <p className=" text-2xl font-bold mb-3 text-blue-900">
           {listing.name} - ${listing.offer ? listing.discountedPrice
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",") 
            : listing.regularPrice
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",") }
            {listing.type === 'rent' ? "/ month" : ""}
            </p>
            <p className='flex items-center mt-6 mb-3 font-semibold '>
            <FaMapMarkerAlt className='text-green-700 mr-1' /> 
             {listing.address}
            </p>
            <div className=' flex justify-center space-x-4 w-[75%]'>
              <p className='bg-red-800 w-full max-w-[200px] 
              rounded-md p-1 text-white text-center font-semibold shadow-md '>
                {listing.type === 'rent' ? "Rent" : "Sale"}
              </p>
              <p className='w-full max-w-[200px] bg-green-800 p-1 
               rounded-md text-white text-center font-semibold shadow-md ' >
               {listing.offer && (
                <p>
                   ${+listing.regularPrice - +listing.discountedPrice} discount
                </p>
               )}
              </p>
            </div>
            <p className='mt-3 mb-3'>
            <span className='font-semibold'> Description</span>   - {listing.description}
            </p>
            <ul className=' mb-6 flex items-center space-x-2 lg:space-x-10 text-sm font-semibold'>
              <li className='flex items-center whitespace-nowrap'>
                <FaBath className='text-lg mr-1'/>
                {+listing.bathrooms > 1 ? `${listing.bathrooms } bedrooms` : `1 bedroom` }
              </li>
              <li className='flex items-center whitespace-nowrap'>
                <FaBed className='text-lg mr-1'/>
                {+listing.bedrooms > 1 ? `${listing.bedrooms } Beds` : `1 Bed` }
              </li>
              <li className='flex items-center whitespace-nowrap'>
                <FaSquareParking className='text-lg mr-1'/>
                {listing.parking  ? ` Parking Spot ` : `No Parking` }
              </li>
              <li className='flex items-center whitespace-nowrap'>
                <FaChair className='text-lg mr-1'/>
                {listing.furnished  ? ` Furnished` : `No Furnished` }
              </li>
            </ul>
            <div className='mt-6 '>
             {listing.userRef !== auth.currentUser?.uid && !contactLandlord && (
                          <button onClick={()=>setContactLandlord(!contactLandlord)}
                           className="w-full text-white font-medium px-7 py-3 text-center
                          bg-blue-600 uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg 
                          focus:bg-blue-700 focus:shadow-lg duration-150 ease-in-out transition ">Contact 
                          </button>
             )}  
            </div>
            {contactLandlord && (
              <Contact 
              userRef={listing.userRef}
              listing={listing}/>
            )}
        </div>
        <div className='bg-blue-300 w-full  overflow-x-hidden'>

        </div>
      </div>
    </main>
  )
}

export default Listings
