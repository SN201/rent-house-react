import React, { useEffect ,useState } from 'react'
import { db } from '../firebase.config';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

const Contact = ({userRef , listing}) => {
    const [landLorde , setLandLorde] = useState(null)
    const [message , setMessage] = useState("")
     function onChange(e) {
        setMessage(e.target.value);
    }

    useEffect(()=>{
        async function getLandlorde(){
            const docRef = doc(db , "users" , userRef  );
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()) {
                setLandLorde(docSnap.data());
            }
            else {
                toast.error("Could not get landLorde data")
            }
        }
        getLandlorde();
    },[userRef])
  return (
    <>
      {landLorde !== null &&  landLorde.email && (
              <div className='flex flex-col w-full'>
              <p className='mb-3'>Contact {landLorde.name} for the {listing.name.toLowerCase()} </p>
              <div>
                <textarea
                 name="message" 
                 value={message} 
                 id="message"  
                 rows="2" 
                 onChange={onChange}
                 className='w-full px-4 py-2 text-xl
                  text-gray-700 border-gray-300 rounded 
                  transition duration-150 ease-in-out 
                  shadow-md
                  focus:bg-white
                  focus:border-slate-600 
                  focus:shadow-xl mb-6'>

                </textarea>
              </div>
               <a href={`https://wa.me/${landLorde.phone}?text=${encodeURIComponent(`Subject: ${listing.name}%0A%0A${message}`)}`}>
  <button className='px-7 py-3 bg-blue-600 text-white text-sm uppercase shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-800 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full text-center' type='button'>
    Contact Landlord via WhatsApp
  </button>
</a>
            </div>
      )}

    </>
  )
}

export default Contact
