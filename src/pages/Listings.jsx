import { doc, getDoc } from 'firebase/firestore'
import React, { useEffect  , useState} from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../firebase.config'
import Spinner from '../components/Spinner'
import { Swiper, SwiperSlide } from "swiper/react";
// import SwiperCore, {
//   EffectFade,
//   Autoplay,
//   Navigation,
//   Pagination,
// } from "swiper";
// } from "swiper/react";
//import "swiper/css/bundle";
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Navigation, Pagination,EffectFade , Autoplay  } from 'swiper/modules';
import { FaShare } from "react-icons/fa";


//import { Swiper, SwiperSlide } from 'swiper/react';

const Listings = () => {
  
    const params=  useParams()
    const [listing , setListing] = useState(null) 
    const [loading , setLoading] = useState(true) 
    const [sharirLinkCopied, setSharirLinkCopied] = useState(false) 

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
        <p className='fixed top-[23%] right-[5%] z-10 font-semibold border-2 border-gray-200 rounded-md bg-white p-1'>Linke Copied</p>
      )}
    </main>
  )
}

export default Listings
