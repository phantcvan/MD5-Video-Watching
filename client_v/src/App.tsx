import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Public from "./pages/Public";
import Home from "./pages/Home";
import Video from "./pages/Video";
import Channel from "./pages/Channel";
import Subscription from "./pages/Subscription";
import Liked from "./pages/Liked";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";
import Library from "./pages/Library";
import History from "./pages/History";
import Hashtag from "./pages/Hashtag";



function App() {
  const dispatch = useDispatch();
  // const allUsers = useSelector(getAllUsers);
  // const userNow = useSelector(getUser);

  const fetchDataUsers = async () => {
    try {
      // const [usersResponse] = await Promise.all([
      //   axios.get(`http://localhost:8000/api/v1/users`),
      // ]);
      // dispatch(setAllUsers(usersResponse?.data.users));
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchDataUsers();
  }, [])
  // console.log(allUsers);


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Public />}>
            <Route path="" element={<Home />} />
            <Route path="/video/:id" element={<Video />} />
            <Route path="/hashtag/:id" element={<Hashtag />} />
            <Route path="/channel/:id" element={<Channel />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/likedVideos" element={<Liked />} />
            <Route path="/library" element={<Library />} />
            <Route path="/history" element={<History />} />
            <Route path="/search" element={<Search />} />

          </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
