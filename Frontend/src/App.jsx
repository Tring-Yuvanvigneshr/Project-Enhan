import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ApolloProvider } from "@apollo/client"
import { Provider } from 'react-redux'
import SignIn from './pages/SignIn/SignIn.jsx'
import Signup from './pages/SignUp/Signup.jsx'
import client from './api/client.js'
import { store } from './redux/store.js'
import Sidebar from './Components/Customer/Sidebar/Sidebar.jsx'
import ProfileInfo from './components/Customer/ProfileInfo/ProfileInfo.jsx'
import ServiceHistory from './Components/Customer/ServiceHistory/ServiceHistory.jsx'
import Services from './Components/Customer/ServiceStats/ServiceStats.jsx'
import WorkerDetails from './Components/Customer/WorkerDeatails/WorkerDetails.jsx'
import ProtectedRoute from './protectedRoute/ProtectedRoute.jsx'
import LandingPage from './pages/LandingPage/landingPage.jsx'
import WorkerForm from './Components/Worker/WorkerForm/WorkerForm.jsx'
import CustomerForm from './Components/Customer/CustomerForm/CustomerForm.jsx'
import WServiceHistory from './components/Worker/WorkerServiceHistory/WorkerServiceHistory.jsx'
import BookingStats from './Components/Worker/Bookingstats/BookingStats.jsx'
import BookingDetails from './components/Worker/WorkerBookingDetails/BookingDetails.jsx'
import WorkerProfile from './components/Worker/Workerprofile/Workerprofile.jsx'
import Dashboard from './components/Customer/Dashboard/Dashboard.jsx';
import WSidebar from './components/Worker/WorkerSidebar/WorkerSidebar.jsx'

const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="content">
        {children}
      </div>
    </div>
  );
};

const WorkerLayout = ({ children }) => {
  return (
    <div className="worker-container">
      <WSidebar />
      <div className="worker-content">
        {children}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <BrowserRouter>
          <Routes>

            <Route path='/signIn' element={<SignIn />} />
            <Route path='/signUp' element={<Signup />} />
            <Route path='/' element={<LandingPage />}></Route>

            <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
              <Route path='/customerForm' element={<CustomerForm />}></Route> { /* passing id */}
              <Route path='/profile' element={<Layout><ProfileInfo /></Layout>} />
              <Route path='/history' element={<Layout><ServiceHistory /></Layout>} />
              <Route path='/services' element={<Layout><Services /></Layout>} />
              <Route path="/workerDetails" element={<WorkerDetails />} />  { /* passing id */}
              <Route path='/dashboard' element={<Dashboard/>}></Route>
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["worker"]} />}>
              <Route path='/workerForm' element={<WorkerForm />}></Route> { /* passing id */}
              <Route path='/wHistory' element={<WorkerLayout><WServiceHistory /></WorkerLayout>} />
              <Route path='/wProfile' element={<WorkerLayout><WorkerProfile /></WorkerLayout>} />
              <Route path='/bookings' element={<WorkerLayout><BookingStats /></WorkerLayout>} />
              <Route path="/booking-details/:id" element={<BookingDetails />} />
            </Route>

          </Routes>
        </BrowserRouter>
      </ApolloProvider>
    </Provider>
  )
}

export default App;
