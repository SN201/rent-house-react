
import { useLocation , useNavigate } from 'react-router-dom';
const Header = () => {
  const location = useLocation();
  const  navigate = useNavigate();
  function pathMathRoute(route) {
    if (route === location.pathname) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <div className='bg-white border-b shadow-sm sticky top-0 z-50'>
      <header className='flex justify-between items-center px-3 max-w-6xl m-auto'>
        <div>
            <img
            src=' https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg'
            alt='Logo'
            className='h-5  cursor-pointer'
            onClick={()=>navigate("/")}
            />
        </div>
        <div>
          <ul className='flex space-x-10 '>

            <li className={` transition duration-150 ease-in-out cursor-pointer ${pathMathRoute("/") ? `text-black border border-b-red-600 py-3 `: ` py-3 text-sm font-semibold text-gray-400  
            border-b-[3px] border-b-transparent`}`
            } onClick={()=>navigate("/")}>Home</li>

            <li className={` transition duration-150 ease-in-out cursor-pointer  ${pathMathRoute("/offers") ? `text-black border border-b-red-600 py-3 `: ` py-3 text-sm font-semibold text-gray-400  
            border-b-[3px] border-b-transparent`}`} onClick={()=>navigate("/offers")}>Offers</li>

            <li className={` transition duration-150 ease-in-out cursor-pointer  ${pathMathRoute("/sig-in") ? `text-black border border-b-red-600 py-3 `: ` py-3 text-sm font-semibold text-gray-400  
            border-b-[3px] border-b-transparent`}`} onClick={()=>navigate("/sig-in")}>Sign in</li>

          </ul>
        </div>
      </header>
    </div>
  )
}

export default Header
