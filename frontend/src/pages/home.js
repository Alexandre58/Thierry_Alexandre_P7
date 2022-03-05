import { NavBar } from "../components/NavBar";
import { Footer } from "../components/Footer";
import { Typography } from "@material-ui/core";
import "../style/home.scss";
import Log from "../components/Log";
import React, { useContext } from "react";
import { UidContext } from "../App";
import { Blog } from "./blog";

export const Home = () => {
  const uid = useContext(UidContext);
  return (
    <>
      {uid ? (
        <Blog />
      ) : (
        <>
          {uid && <NavBar />}
          <main className="mainRoot">
            <section className="section_home">
              <div className="h1_Home">
                <Typography variant="h1" className="h1_home_titre">
                  Bienvenu sur Groupomania
                </Typography>
              </div>
              <div className="connection-form">
                <div className="form-container">
                  <Log signin={false} signup={true} />
                </div>
              </div>
            </section>
          </main>
          <Footer />
        </>
      )}
    </>
  );
};