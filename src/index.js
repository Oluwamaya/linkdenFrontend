import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/js/bootstrap.bundle.min'
import "bootstrap/dist/css/bootstrap.min.css";

import App from './App';
import Sign from './Component/Sign';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Dashboard from './Component/Dashboard'
import Button from './props/Button';
import User from './Component/User';
import ForgotPass from './Component/ForgotPass';
import Chat from './ChatFolder/Chat';
import Home from './Component/Home';
import NetworkPage from './Component/NetworkPage';
import { Provider } from 'react-redux';
import Store from './Redux/Store';
import Notification from './Component/Notification';
import Review from './Component/Review';
import 'bootstrap/dist/js/bootstrap.bundle.min'
import "bootstrap/dist/css/bootstrap.min.css";




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={Store}>
    <BrowserRouter>
    <Routes>
    <Route path='/' element={<App/>}/>
      <Route path="/sign" element={<Sign/>}/>
      <Route path='/dashboard' element={<Dashboard/>}>
        <Route path='/dashboard/Home' element={<Home/>}/>
        <Route path="/dashboard/Network" element={<NetworkPage/>}/> 
        </Route>
        <Route path='/network/:id' element={<NetworkPage/>}/>
        {/* <Route path='/message/:id' element={<Message/>}/> */}
        <Route path='/notifications' element={<Notification/>}/>
      <Route path='/Button' element={<Button/>}/>
      <Route path="/user" element={<User/>}/>
      <Route path='/forgotpass' element={<ForgotPass/>}/>
      <Route path='/chats' element={<Chat/>}/>
      <Route path='/YourReview' element={<Review/>}/>     
    </Routes>
    </BrowserRouter>   
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
