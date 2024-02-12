import Moment from "react-moment"
import { Link } from "react-router-dom"
import { MdLocationOn } from "react-icons/md";
const ListingItem = ({listing , id}) => {
  return (
    <li className="relative bg-white flex flex-col justify-between items-center shadow-md hover:shadow-xl rounded-md overflow-hidden m-[10px]">
      <Link className="contents" to={`category/${listing.type}/${id}`} >
        <img
        src={listing.imgUrls[0]}
        alt=""
        loading="lazy"
        className="h-[170px] w-full object-cover hover:scale-105 transition duration-200 ease-in"
       
        />
        <Moment fromNow className="absolute top-2 left-2 bg-[#3377cc] text-white uppercase text-xs font-semibold rounded-md px-2 py-1 shadow-lg ">
            {listing.timestamp?.toDate()}
        </Moment>
        <div className="w-full p-[10px]">
            <div className="flex items-center space-x-1">
            <MdLocationOn className="h-4 w-4 text-green-600 " />
            <p className="font-semibold text-sm mb-[2px] text-gray-600 truncate">{listing.address}</p>
            </div>
            <p className="font-semibold mt-2 text-lg  truncate">{listing.name}</p>
            <p className=" mt-2 font-semibold text-[#457b9d]">
            {listing.offer ? listing.discountedPrice
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",") 
            : listing.regularPrice
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",") }
            {listing.type === 'rent' && "/ month"}
            </p>
            <div className="flex mt-[10px] items-center space-x-4">
              <div className="flex items-center space-x-1">
                <p className="font-semibold text-sm">{listing.bedrooms> 1 ? `${listing.bedrooms} Beds` : `${listing.bedrooms} Bed`}</p>
              </div>
              <div className="flex items-center space-x-1">
                <p className="font-semibold text-sm" >{listing.bathrooms> 1 ? `${listing.bathrooms} Baths` : `${listing.bedrooms} Bath`}</p>
              </div>
            </div>
        </div>
      </Link>
    </li>
  )
}

export default ListingItem
