import React from 'react'
import ReactDOM from 'react-dom'
import './App.css'
import App from './App'
import ForgotPassword from './Pages/ForgotPassword'
import ResetPassword from './Pages/ResetPassword'
import ConfirmAccount from './Pages/ConfirmAccount'
import Home from './Pages/Home'
import Categories from './Pages/Categories'
import Profile from './Pages/Profile'
import Users from './Pages/Users'
import RegisterUser from './Pages/RegisterUser'
import PublicProfile from './Pages/PublicProfile'
import Dashboard from './Pages/Dashboard'
import PageNotFound from './Pages/404Page'
import ConfirmPendingAccount from './Pages/ConfirmPendingAccount'
import Header from './Components/CommonElements/Header'
import Footer from './Components/CommonElements/Footer'
import reportWebVitals from './reportWebVitals'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes, BrowserRouter } from "react-router-dom"

function Routing() {
  return (
    <div>
      <Routes>
        <Route path="/forgotPassword" element={<>
          <ForgotPassword />
        </>} />
        <Route path="/reset-password" element={<>
          <ResetPassword />
        </>} />
        <Route path="/confirm-account" element={<>
          <ConfirmAccount />
        </>} />
        <Route path="/pending" element={<>
          <ConfirmPendingAccount />
        </>} />
        <Route path="/home" element={<>
          <Header />
          <Home />
        </>} />
        <Route path="/alltasks" element={<>
          <Header />
          <Home />
        </>} />
        <Route path="/users" element={<>
          <Header />
          <Users />
        </>} />
        <Route path="/categories" element={<>
          <Header />
          <Categories />
        </>} />
        <Route path="/register-user" element={<>
          <Header />
          <RegisterUser />
        </>} />
        <Route path="/edit/:username" element={<>
          <Header />
          <Profile />
        </>} />
        <Route path="/profile/:username" element={<>
          <Header />
          <PublicProfile />
        </>} />
        <Route path="/dashboard" element={<>
          <Header />
          <Dashboard />
        </>} />
        <Route index element={<App />} /> 
        <Route path="/404" element={<>
          <PageNotFound />
        </>} />
      </Routes>
      <Footer />
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    
    <BrowserRouter>
      <Routing />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
