import { BrowserRouter } from 'react-router-dom'
import './App.css'
import Router from './routes'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { useAppDispatch } from './app/hooks';
import { getUser } from './app/slices/userSlide';

function App() {

  const dispatch = useAppDispatch();
  const access_token = localStorage.getItem('access_token');

  useEffect(()=>{
    if(access_token){
      dispatch(getUser(access_token))
    }
  }, [])

  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Router/>
      </BrowserRouter>
    </>
  )
}

export default App
