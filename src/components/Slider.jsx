import React, { useEffect, useState } from 'react'
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase.config';
import Spinner from './Spinner';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Navigation, Pagination,EffectFade , Autoplay  } from 'swiper/modules';
import { Swiper, SwiperSlide } from "swiper/react";
import { useNavigate } from 'react-router-dom';
const Slider = () => {
const [listings , setListings] = useState(null)
const [loading , setLoading] = useState(true)
const navigate = useNavigate();
useEffect(() => {
  async function fetchListing() {
    try {
      const listingRef = collection(db, 'listings');
      const q = query(listingRef, orderBy("timestamp", "desc"), limit(5));
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching listings:", error);
      setLoading(false); // Make sure to set loading to false even in case of errors
    }
  }
  
  fetchListing();
}, []);

  if(loading){
    return <Spinner/>
  }
  if(listings.length === 0 ){
    return <></>
  }
  return (
    <>
      {listings && (
  <Swiper
    slidesPerView={1}
    navigation
    pagination={{ type: "progressbar" }}
    effect="fade"
    modules={[EffectFade, Autoplay, Pagination, Navigation]}
    autoplay={{ delay: 3000, disableOnInteraction: false }}
  >
    {listings.map(({data, id}) => (
      <SwiperSlide key={id}   onClick={() => navigate(`/category/${data.type}/${id}`)}>
        <div className='relative w-full h-[380px] overflow-hidden' style={{ background: `url(${data.imgUrls[0]}) center, no-repeat`, backgroundSize: "cover" }}>
          <p className='text-[#f1faee] absolute left-1 top-3 font-medium
          max-w-[90%] bg-[#457b9d] shadow-lg opacity-90 p-2 rounded-br-3xl'>{data.name}</p>
         <p className='text-[#f1faee] absolute left-1 bottom-1 font-medium
          max-w-[90%] bg-[#e63946] shadow-lg opacity-90 p-2 rounded-tr-3xl'>
            {data.discountedPrice ?? data.regularPrice}
            {data.type === 'rent' && " / month"}
          </p>
        </div>
      </SwiperSlide>
    ))}
  </Swiper>
)}

    </>
  )
}

export default Slider
