import React, { useEffect, useState } from 'react'
import Slider from '../components/Slider'
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { db } from '../firebase.config';
import { Link } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

const Home = () => {
  const [offerListings , setOfferListings] = useState(null);
  const [rentListings , setRentListings] = useState(null);
  const [saleListings , setSaleListings] = useState(null);
  
  //ofers
  useEffect(() =>{
    async function fetchOfferListings(){
      try {
        const listingRef = collection(db , "listings");
        const q = query(listingRef , where("offer" , "==" , true),
         orderBy("timestamp" ,"desc") , limit(4));
         const querySnap = await getDocs(q);
         let listings = [];
        querySnap.forEach((doc)=>{
          return listings.push({
            id : doc.id,
            data : doc.data()
          });
        });
        setOfferListings(listings);
        console.log(listings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchOfferListings();
  },[]);
  //place for rent 
  useEffect(() =>{
    async function fetchRentListings(){
      try {
        const listingRef = collection(db , "listings");
        const q = query(listingRef , where("type" , "==" , "rent"),
         orderBy("timestamp" ,"desc") , limit(4));
         const querySnap = await getDocs(q);
         let listings = [];
        querySnap.forEach((doc)=>{
          return listings.push({
            id : doc.id,
            data : doc.data()
          });
        });
        setRentListings(listings);
        console.log(listings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchRentListings();
  },[]);
  /// place for sale 
  useEffect(() =>{
    async function fetchSaleListings(){
      try {
        const listingRef = collection(db , "listings");
        const q = query(listingRef , where("type" , "==" , "sale"),
         orderBy("timestamp" ,"desc") , limit(4));
         const querySnap = await getDocs(q);
         let listings = [];
        querySnap.forEach((doc)=>{
          return listings.push({
            id : doc.id,
            data : doc.data()
          });
        });
        setSaleListings(listings);
        console.log(listings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchSaleListings();
  },[]);
  return (
    <div >
      <Slider/>
      <div className='max-w-6xl mx-auto pt-4 space-y-6'>
      {offerListings && offerListings.length > 0 && (
          <div className=' m-2 mb-6' >
            <h2 className='px-3 text-2xl mt-6 font-semibold'>
              Recent Offer
            </h2>
            <Link to="/offers">
              <p className='px-3 text-sm text-blue-600 hover:text-blue-800
              transition duration-150 ease-in-out '>Show more Offers</p>
            </Link>
              <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {offerListings.map((listing)=>(
                  <ListingItem 
                  key={listing.id}
                  listing={listing.data} />
                ))}
              </ul>
          </div>
      )}
      {saleListings && saleListings.length > 0 && (
          <div className=' m-2 mb-6' >
            <h2 className='px-3 text-2xl mt-6 font-semibold'>
              Recent Offer
            </h2>
            <Link to="/category/sale">
              <p className='px-3 text-sm text-blue-600 hover:text-blue-800
              transition duration-150 ease-in-out '>Show more Places for sale</p>
            </Link>
              <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {saleListings.map((listing)=>(
                  <ListingItem 
                  key={listing.id}
                  listing={listing.data} />
                ))}
              </ul>
          </div>
      )}
      {rentListings && rentListings.length > 0 && (
          <div className=' m-2 mb-6' >
            <h2 className='px-3 text-2xl mt-6 font-semibold'>
              Recent Offer
            </h2>
            <Link to="/category/rent">
              <p className='px-3 text-sm text-blue-600 hover:text-blue-800
              transition duration-150 ease-in-out '>Show more Places for rent</p>
            </Link>
              <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {rentListings.map((listing)=>(
                  <ListingItem 
                  key={listing.id}
                  listing={listing.data} />
                ))}
              </ul>
          </div>
      )}
      </div>
    </div>
  )
}

export default Home
