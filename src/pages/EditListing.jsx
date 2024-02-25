import React, { useEffect, useState , useCallback } from 'react'
import {toast} from 'react-toastify'
import Spinner from '../components/Spinner';
import { getAuth} from "firebase/auth";
import {v4 as uuidv4} from 'uuid';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {  serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { useNavigate, useParams } from 'react-router-dom';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
const EditListing = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    const [geolocationEnabled, setGeolocationEnabled] = useState(true);  
    const [loading , setLoading] = useState(false);
    const [listing , setListing] = useState(null);
    const [number, setNumber] = useState('');
    const onChangeNumber = useCallback((phoneNumber) => {
      setNumber(phoneNumber);
      setFormData({ ...formData, phone: phoneNumber });
  }, []);
    const [formData , setFormData] = useState({
        type:"rent",
        name:"",
        bedrooms:1,
        phone:number,
        bathrooms:1,
        parking:false,
        furnished:false,
        address:"",
        description:"",
        offer:true,
        regularPrice:0,
        discountedPrice:0,
        latitude:0,
        longitude:0,
        images:{},
    })
    const {type , name ,bedrooms ,bathrooms ,parking ,furnished 
      ,address ,description ,offer ,regularPrice,phone
       ,discountedPrice , latitude ,longitude , images} = formData ; 
       
       const params = useParams();
      useEffect(()=>{
        setLoading(true);
        async function fetchListing(){
          const docRef = doc(db , "listings" , params.listingID);
          const docSnap = await getDoc(docRef);
          if(docSnap.exists()){
            setListing(docSnap.data());
            setFormData({...docSnap.data()});
            console.log(listing);
            setLoading(false);
          }
          else{
            navigate("/")
            toast.error("Listing is not exists");
          }
        }
        fetchListing();
      },[navigate ,params.listingID ])

      useEffect(()=>{
        if(listing && listing.userRef !== auth.currentUser.uid ){
          toast.error("You can't edit this listing")
          navigate("/")
        }

      },[auth.currentUser.uid , listing , navigate])

    function onChange(e){
        let boolean = null;
        if(e.target.value === "true"){
            boolean = true;
        }
        if(e.target.value === "false"){
            boolean = false;
        }
        if(e.target.files){
           setFormData((prevState)=>({
            ...prevState , 
            images:e.target.files
           }))
            }
        
        if(!e.target.files){
            setFormData((prevState)=>({
                ...prevState , 
                [e.target.id] : boolean ?? e.target.value,
            }))

    }
}
const key = "9dRlHkI1LHndCwLKVM9wiEkOIOURybqx";
async function onSubmit (e){
    e.preventDefault();
    setLoading(true);
    console.log("In fuctiion ")

    if(+discountedPrice >= +regularPrice){
    setLoading(false);
    toast.error("Discounted Price needs to less than Regular Price");
    return ;}

    if (images && images.length > 6) {
      setLoading(false);
      toast.error("Maximum 6 images are allowed");
      return;
  }


        let geolocation = {};
        //let location;
        if (geolocationEnabled) {
          const response = await fetch(`https://api.tomtom.com/search/2/geocode/${address}.json?storeResult=false&view=Unified&key=${key}`);
          const data = await response.json();
          console.log(data);
          
          // Check if the response contains valid data and latitude/longitude values
          if (data.results.length === 0 || !data.results[0].position || isNaN(data.results[0].position.lat) || isNaN(data.results[0].position.lon)) {
              setLoading(false);
              toast.error("Please enter a correct address.");
              return;
          }
      
          // Assign latitude and longitude values to geolocation
          geolocation.lat = data.results[0].position.lat;
          geolocation.lon = data.results[0].position.lon;
      }
      
      // Check if geolocation contains valid latitude and longitude values
      if (geolocation.lat === undefined || geolocation.lon === undefined) {
          setLoading(false);
          toast.error("Error retrieving geolocation data. Please try again.");
          return;
      }
              async function storeImage(image){
            return new Promise((resolve, reject)=>{
                const  storage  = getStorage();
                const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
                const storageRef = ref(storage, filename);
                const uploadTask = uploadBytesResumable(storageRef, image); 
        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on('state_changed', 
        (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
        case 'paused':
        console.log('Upload is paused');
        break;
        case 'running':
        console.log('Upload is running');
        break;
        }
        }, 
        (error) => {
        // Handle unsuccessful uploads
        reject(error)
        }, 
        () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        resolve( downloadURL);
        });
        }
        );
            });

        }
        const imgUrls = await Promise.all(
          [...images].map((image) => storeImage(image))
        ).catch((error) => {
          setLoading(false);
          console.log(error);
          toast.error("Images not uploaded");
          return;
        });
        
        
            console.log(imgUrls)

            const formDataCopy = {
                ...formData,
                imgUrls , 
                geolocation , 
                timestamp: serverTimestamp(),
                userRef: auth.currentUser.uid,
            };
            delete formDataCopy.images;
            !formDataCopy.offer && delete formDataCopy.discountedPrice;
            // delete formDataCopy.latitude;
            // delete formDataCopy.longitude;
           
            //  const docRef = await updateDoc(doc(db, "listings", params.listingID));
            // await updateDoc(docRef, formDataCopy);
            const docRef = doc(db, "listings", params.listingID); // Get the document reference
            await updateDoc(docRef, formDataCopy); // Update the document with formDataCopy
            
            setLoading(false);
            toast.success("Listing created");
            navigate(`/category/${formDataCopy.type}/${docRef.id}`);
}

            if(loading){
                return <Spinner/>
            }    
  return (
    <main className='max-w-md px-2 m-auto'>
        <h1 className='text-3xl text-center font-bold mt-6'>Edit a Listing</h1>
        <form>
            <p className='text-lg mt-6 font-semibold'>Sell or Rent</p>
            <div className='flex  '>
                <button type='button'
                 id="type"
                  value="sale"
                   className = {` mr-3 px-7 py-3 font-medium text-sm uppercase 
                   shadow-md rounded hover:shadow-lg focus:shadow-lg 
                   active:shadow-lg transition duration-150  ease-in-out w-full ${type === "rent" ? "bg-white text-black" : "bg-slate-600 text-white" }`}
                   onClick={onChange} 
                   >
                    Sell
                </button>
                <button type='button'
                 id="type"
                  value={"rent"}
                   className = {` ml-3 px-7 py-3 font-medium text-sm uppercase 
                   shadow-md rounded hover:shadow-lg focus:shadow-lg 
                   active:shadow-lg transition duration-150  ease-in-out w-full ${type === "sale" ? "bg-white text-black" : "bg-slate-600 text-white" }`}
                   onClick={onChange} 
                   >
                    Rent
                </button>
            </div>
            <p className='text-lg mt-6 font-semibold'>Name</p>
            <input type='text'
             id='name'
              value={name}
              onChange={onChange}
              placeholder='Name'
               maxLength="32"
              minLength="10"
              required
              className='w-full px-4 py-2 text-xl text-gray-700 
              bg-white border-gray-300 rounded transition duration-150 
              ease-in-out focus:text-gray-700 focus:bg-white border focus:border-slate-600'/>
              <br/>
               <p className='text-lg mt-6 font-semibold'>Phone Number</p>
               <PhoneInput
                id='phone'
                placeholder="Enter phone number"
                value={phone}
                onChange={onChangeNumber}
            />
                {/* <input type='text'
                 id='phone'
                  value={number}
                  onChange={onChangeNumber}
                  placeholder='Phone Number'
                  pattern="[0-9]*" 
                 maxLength="32"
                  minLength="10"
                  required
                  className='w-full px-4 py-2 text-xl text-gray-700 
                  bg-white border-gray-300 rounded transition duration-150 
                  ease-in-out focus:text-gray-700 focus:bg-white border focus:border-slate-600'/> */}
              <div className='flex space-x-6 '>
                <div>
                    <p className='w-full text-lg font-semibold'>Beds</p>
                    <input type='number'
                    id='bedrooms'
                    value={bedrooms}
                    onChange={onChange} 
                    min={1}
                    max={50}
                    required
                    className='px-4 py-2 text-xl text-gray-700 bg-white border
                     border-gray-300 rounded transition duration-150 ease-in-out
                     focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center' />
                </div>
                <div>
                    <p className='w-full text-lg font-semibold'>Bath</p>
                    <input type='number'
                    id='bathrooms'
                    value={bathrooms}
                    onChange={onChange} 
                    min={1}
                    max={50}
                    required
                    className='px-4 py-2 text-xl text-gray-700 bg-white border
                     border-gray-300 rounded transition duration-150 ease-in-out
                     focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center' />
                </div>
              </div>
               <p className='text-lg mt-6 font-semibold'>parking Spot</p>
              <div className='flex mb-6 '>
                <button type='button'
                 id="parking"
                  value={true}
                   className = {` mr-3 px-7 py-3 font-medium text-sm uppercase 
                   shadow-md rounded hover:shadow-lg focus:shadow-lg 
                   active:shadow-lg transition duration-150  ease-in-out w-full ${ !parking ? "bg-white text-black" : "bg-slate-600 text-white" }`}
                   onClick={onChange} 
                   >
                    yes
                </button>
                <button type='button'
                 id="parking"
                  value={false}
                   className = {` ml-3 px-7 py-3 font-medium text-sm uppercase 
                   shadow-md rounded hover:shadow-lg focus:shadow-lg 
                   active:shadow-lg transition duration-150  ease-in-out w-full ${parking ? "bg-white text-black" : "bg-slate-600 text-white" }`}
                   onClick={onChange} 
                   >
                    no
                </button>
            </div>
            
            <p className='text-lg mt-6 font-semibold'>Furnished</p>
            <div className='flex  '>
                <button type='button'
                 id="furnished"
                  value={true}
                   className = {` mr-3 px-7 py-3 font-medium text-sm uppercase 
                   shadow-md rounded hover:shadow-lg focus:shadow-lg 
                   active:shadow-lg transition duration-150  ease-in-out w-full ${!furnished ? "bg-white text-black" : "bg-slate-600 text-white" }`}
                   onClick={onChange} 
                   >
                    yes
                </button>
                <button type='button'
                 id="furnished"
                  value={false}
                   className = {` ml-3 px-7 py-3 font-medium text-sm uppercase 
                   shadow-md rounded hover:shadow-lg focus:shadow-lg 
                   active:shadow-lg transition duration-150  ease-in-out w-full ${furnished ? "bg-white text-black" : "bg-slate-600 text-white" }`}
                   onClick={onChange} 
                   >
                    no
                </button>
            </div>
            <p className='text-lg mt-6 font-semibold'>Address</p>
            <textarea type='text'
              id='address'
              value={address}
              onChange={onChange}
              placeholder='Address'
               maxLength="32"
              minLength="10"
              required
              className='w-full px-4 py-2 text-xl text-gray-700 
              bg-white border-gray-300 rounded transition duration-150 
              ease-in-out focus:text-gray-700 focus:bg-white border focus:border-slate-600 text-center'/>
              <div className='flex space-x-6 '></div>

              { !geolocationEnabled && (
                <div className='flex space-x-6 justify-start mb-6'>
                    <div>
                        <p className='text-lg font-semibold'>Latitude</p>
                        <input type='number'
                        id='latitude'
                        value={latitude}
                        onChange={onChange}
                        required
                        min="-180"
                        max="180"
                        className='w-full px-4 py-2 text-xl text-gray-700 bg-white border
                        border-gray-300 rounded transition duration-150 ease-in-out
                        focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center'/>
                    </div>
                    <div>
                        <p className='text-lg font-semibold'>Longitude</p>
                        <input type='number'
                        id='longitude'
                        value={longitude}
                        onChange={onChange}
                        min="-180"
                        max="180"
                        required
                        className='w-full px-4 py-2 text-xl text-gray-700 bg-white border
                        border-gray-300 rounded transition duration-150 ease-in-out
                        focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center'/>
                    </div>
                </div>
              )
              }
            
              <p className='text-lg mt-6  font-semibold'>Description</p>
            <textarea type='text'
              id='description'
              value={description}
              onChange={onChange}
              placeholder='Description'
               maxLength="500"
              minLength="10"
              required
              className='w-full px-4 py-2 text-xl text-gray-700 
              bg-white border-gray-300 rounded transition duration-150 
              ease-in-out focus:text-gray-700 focus:bg-white border focus:border-slate-600'/>
              <div className='flex space-x-6 '></div>
             
              <p className='text-lg mt-6  font-semibold'>Offer</p>
            <div className='flex  '>
                <button type='button'
                   id="offer"
                   value={true}
                   className = {` mr-3 px-7 py-3 font-medium text-sm uppercase 
                   shadow-md rounded hover:shadow-lg focus:shadow-lg 
                   active:shadow-lg transition duration-150  ease-in-out w-full ${!offer ? "bg-white text-black" : "bg-slate-600 text-white" }`}
                   onClick={onChange} 
                   >
                    yes
                </button>
                <button type='button'
                 id="offer"
                  value={false}
                   className = {` ml-3 px-7 py-3 font-medium text-sm uppercase 
                   shadow-md rounded hover:shadow-lg focus:shadow-lg 
                   active:shadow-lg transition duration-150  ease-in-out w-full ${offer ? "bg-white text-black" : "bg-slate-600 text-white" }`}
                   onClick={onChange} 
                   >
                    no
                </button>
            </div>
            <div className=' flex justify-start items-center mb-6'>
                <div >
                <p className='w-full mt-6 text-lg font-semibold'>Regular Price</p>
                    <div className='flex w-full justify-center items-center space-x-6'>
                    <input type='number'
                    id='regularPrice'
                    value={regularPrice}
                    onChange={onChange} 
                    min="50"
                    max="400000000"
                    required
                    className='px-4 py-2 text-xl text-gray-700 bg-white border
                     border-gray-300 rounded transition duration-150 ease-in-out
                     focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center' />
                       {type === "rent" && (
                        <div>
                            <p className=' text-md w-full whitespace-nowrap'
                            >$ / Month</p>
                        </div>
                     )}
                     </div>
                </div>
            </div>
            {offer &&(<div className=' flex justify-start items-center mb-6'>
                <div >
                <p className='w-full mt-6 text-lg font-semibold'>Discounted Price</p>
                    <div className='flex w-full justify-center items-center space-x-6'>
                    <input type='number'
                    id='discountedPrice'
                    value={discountedPrice}
                    onChange={onChange} 
                    min="50"
                    max="400000000"
                    required ={offer}
                    className='px-4 py-2 text-xl text-gray-700 bg-white border
                     border-gray-300 rounded transition duration-150 ease-in-out
                     focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center' />
                       {type === "rent" && (
                        <div>
                            <p className=' text-md w-full whitespace-nowrap'
                            >$ / Month</p>
                        </div>
                     )}
                     </div>
                </div>
            </div>)}
            <div className='mb-6'>
                <p className='w-full mt-6 text-lg font-semibold'>Images</p>
                <p className='text-gray-600 mb-1'>the first image will be the cover (max 6)</p>
                <input type='file'
                id="images"
                onChange={onChange}
                accept='.jpg , .png , jpeg '
                multiple
                required
                className='w-full px-3 py-1.5 text-gray-700 bg-white border
                 border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:border-slate-600'/>
            </div>
            <button type='submit' onChange={onSubmit} onClick={onSubmit}
            className='mb-6 w-full px-7 py-3 bg-blue-600 text-white font-medium 
            text-sm uppercase  rounded shadow-md hover:bg-blue-700 hover:shadow-lg 
            focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out'
            >Edit Listing</button>
        </form>
    </main>
  )
}

export default EditListing
