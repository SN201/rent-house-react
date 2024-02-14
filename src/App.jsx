import {BrowserRouter as Router , Routes , Route} from 'react-router-dom'
import Home from './pages/Home'
import Profile from './pages/Profile'
import ForgotPassword from './pages/ForgotPassword'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Offers from './pages/Offers'
import PrivateRoute from './components/PrivateRoute'
import Header from './components/Header'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateListing from './pages/CreateListing'
import EditListing from './pages/EditListing'
import Listings from './pages/Listings'
function App() {
  return (
    <>
     <Router>
      <Header/>
        <Routes>
            <Route path="/" element={<Home />} />

            <Route path='/profile' element ={ <PrivateRoute/>}>
            <Route path="/profile" element={<Profile />} />
            </Route>

            <Route path="/sig-in" element={<SignIn/>} />
            <Route path="/sig-up" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/category/:categoryName/:listingID" element={<Listings />} />
            <Route path="/create-listing" element={<PrivateRoute />} >
            <Route path="/create-listing" element={<CreateListing />} />
            </Route>
            <Route path="/edit-listing" element={<PrivateRoute />} >
            <Route path="/edit-listing/:listingID" element={<EditListing />} />
            </Route>
        </Routes>
     </Router>
     <ToastContainer
position="top-right"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="dark"
/>
    </>
  )
}

export default App
