
import React, { useContext } from "react";
import { UidContext } from "../App";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { isEmpty, findUser } from "./Utils";

//css
import "../style/navBar.scss";
export const NavBar = ({ uid, user }) => {
  return (
    <>
      <header className="header_navBar">
        <nav className="navBarSite">
          <ul className="ulHome">
            {uid ? (
              <li>
                <Link to="/deconnexion">Deconnection</Link>
              </li>
            ) : (
              <li>
                <Link to="/">Connexion</Link>
              </li>
            )}

            <li>
              <Link to="/Blog">Blogs</Link>
            </li>
            <li>
              <Link to="/Profil">Profil</Link>
            </li>
          </ul>
        </nav>

        {uid ? (
          <p className="p_Navbar">
            {" "}
            Bonjour {!isEmpty(user) && user.firstname}
          </p>
        ) : (
          <p className="p_Navbar">Merci de bien vouloir vous connecter</p>
        )}

        <Link to="/Blog">
          <div className="img_navBar">
            <img
              src={require("../images/icon-left-font-long.png")}
              alt="logo de notre site groupomania"
            />
          </div>
        </Link>
      </header>
    </>
  );
};