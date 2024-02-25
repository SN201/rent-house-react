import React from 'react'
import { useEffect } from "react"
import { useState } from "react"
import { collection, query, where, orderBy, limit, getDocs, startAfter } from 'firebase/firestore';
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";
import { useParams } from 'react-router-dom';
const Category = () => {

    const [listings , setListings] = useState(null)
    const [loading , setLoading] = useState(true)
    const [lastFetchListings, setLastFetchListings] = useState(null);
    const param = useParams();
    useEffect(()=>{
      async function fetchListings(){
        try {
          const listingRef = collection(db , "listings") ; 
         const  q = query(listingRef , where("type" , "==" , param.categoryName) , orderBy("timestamp" ,"desc") , limit(8)) ;
          const querySnap = await getDocs(q) ;
          let listings = [] ; 
          let lastVisible = querySnap.docs[querySnap.docs.length -1] ; 
          setLastFetchListings(lastVisible);
          querySnap.forEach((doc)=>{
            return listings.push({
              id : doc.id , 
              data : doc.data()
            })
          }) 
          setListings(listings);
          console.log(listings);
          setLoading(false);
        } catch (error) {
          console.log(error);
          toast.error("Could not Get Listings");
        }
      }
      fetchListings();
  
    },[param.categoryName])
    async function onFetchMoreListings(){
        try {
          const listingRef = collection(db , "listings") ; 
         const  q = query(listingRef , where("type" , "==" , param.categoryName) , orderBy("timestamp" ,"desc") , limit(4) , startAfter(lastFetchListings)) ;
          const querySnap = await getDocs(q) ; 
          let lastVisible = querySnap.docs[querySnap.docs.length -1] ; 
          setLastFetchListings(lastVisible);
          querySnap.forEach((doc)=>{
            return listings.push({
              id : doc.id , 
              data : doc.data()
            })
          }) 
          setListings((prevState)=>[...prevState,...listings]);
          setLoading(false);
        } catch (error) {
          console.log(error);
          toast.error("Could not Get Listings");
        }
      }
    
  return (
    <div className="max-w-6xl mx-auto px-3 ">
    <h1 className="text-3xl text-center mt-6 font-bold mb-6">
      {param.categoryName === "rent" ? "Places for Rent "  : "Place for Sale"}
    </h1>
    {loading ? (
    <Spinner/>
    ) : listings && listings.length > 0 ? (
      <>
      <main>
        <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3
         xl:grid-cols-4 2xl:grid-cols-5">
          {listings.map((listing) => (
              <ListingItem
                key={listing.id}
                id={listing.id}
                listing={listing.data}
              />
            ))}
        </ul>
      </main>
      {lastFetchListings && (
        <div className="flex justify-center items-center">
          <button className="bg-white py-1.5 text-gray-700 
           border-gray-300 mb-6 mt-6 hover:border-slate-600 hover:px-2 hover:shadow-lg  hover:border  hover:border-spacing-2 transition
            duration-150 ease-in-out  rounded " onClick={onFetchMoreListings}>Load More</button>
        </div>
      )}
      </>
    ):(
    <p>There is no  current offers  for  {param.categoryName === "rent" ? "Places for Rent "  : "Place for Sale"}</p>
    )}
  </div>
  )
}

export default Category