
import React, { useEffect, useState, createContext } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { Home } from "./pages/home";
import { Profil } from "./pages/profil";
import { Blog } from "./pages/blog";
import Logout from "./components/Log/Logout";
import axios from "axios";

import { useDispatch } from "react-redux";
//import { getUserToken } from "./actions/user.actions";
import { getUser, getUserToken } from "./actions/user.actions";

export const UidContext = createContext();

const App = () => {
  const [userId, setUserId] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    let fetchToken = async () => {
      await axios({
        method: "get",
        url: `${process.env.REACT_APP_API_URL}/tokenRecup`,
        withCredentials: true,
      })
        .then(res => {
          if (res.data) setUserId(res.data.id);
          else setUserId(null);
        })
        .catch(err => console.log("err"));
    };
    fetchToken();
    //if (userId) dispatch(getUserToken());
  }, [userId]);

  return (
    <UidContext.Provider value={userId}>
      <Router>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/deconnexion" component={Logout} />
          <Route path="/profil" element component={Profil} />
          <Route path="/blog" element component={Blog} />
          {/*  <Route path="/login" element component={Login} />
          <Route path="/signUp" element component={SignUp} />*/}
          <Redirect to="/" />
        </Switch>
      </Router>
    </UidContext.Provider>
  );
};

export default App;