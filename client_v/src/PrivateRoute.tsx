import { Outlet, Navigate, useParams, useNavigate } from "react-router";
import { useDispatch, useSelector } from 'react-redux';
// import { getUser, setUser } from "./slices/whitelist";
import { useState, useEffect } from "react";
import axios from "axios";
// import { setNotification } from "./slices/userSlice";

const PrivateRoute = () => {
  const { userId } = useParams();
  // console.log("Params", userId);
  
  const navigate = useNavigate();
  // const user = useSelector(getUser);
  const user = true;
  const token = localStorage.getItem("authToken");
  const dispatch = useDispatch();
  const fetchDataUsers = async () => {
    try {
      if (token) {
        const [usersResponse, ] = await Promise.all([
          axios.post(`http://localhost:8000/api/v1/users/auth`, { token: token }),
        ]);
        // dispatch(setUser(usersResponse?.data?.findUser[0]));
        // dispatch(setNotification(usersResponse?.data?.findUser[0]?.notification));
      //   if (userId) {
      //     if (usersResponse?.data?.findUser[0]) {
      //         navigate(`/user/${userId}`);
      //         dispatch(setNotification(usersResponse?.data?.findUser[0].notification))
      //     }
      // } else if (usersResponse?.data?.findUser[0]) navigate("/");
  
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchDataUsers();
  }, [])


  return (
    user ? <Outlet /> : <Navigate to="/login" />
  )
}

export default PrivateRoute