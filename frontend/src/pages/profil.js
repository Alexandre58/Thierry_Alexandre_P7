//raccourci rsc
import React, { useContext, useEffect, useState } from "react";
import { UidContext } from "../App";
import { useDispatch, useSelector } from "react-redux";
import BtnValid from "../components/BtnValid";

//css
import "../style/profils.scss";
//import
import { NavBar } from "../components/NavBar";
import { Home } from "../pages/home";
import UploadImg from "../images/UploadImg";
//material ui
import { Typography } from "@material-ui/core";
import { Footer } from "../components/Footer";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import { updateBio } from "../actions/user.actions";
import { findUser } from "../components/Utils";
import BtnDelete from "../components/BtnDelete";
import { getUsers } from "../actions/allUsers.actions";

export const Profil = () => {
  var str = window.location.href;
  var url = new URL(str);
  var userProfileId = parseInt(url.searchParams.get("nn"));
  const users = useSelector(state => state.allUsersReducer);
  const userProfile = findUser(userProfileId, users);
  const dispatch = useDispatch();
  //BIO
  const [bio, setBio] = useState("");
  const [updateForm, setUpdateForm] = useState(false);
  //USER
  const uid = useContext(UidContext);
  let user = useSelector(state => state.userReducer);
  //function validate change bio
  const handleUpdate = () => {
    dispatch(updateBio(user.id, bio));
    setUpdateForm(false);
  };
  useEffect(() => {
    dispatch(getUsers());
  }, []);

  return (
    <>
      {uid && <NavBar uid={uid} user={user} />}

      {!uid ? (
        <Home />
      ) : (
        <section className="section_profil">
          <div className="profil_container">
            <Typography variant="h1" className="h1profil">
              {!userProfile ? (
                <>Vous pouvez changer votre bio et votre photo</>
              ) : (
                <>profile de : {userProfile.firstname}</>
              )}
            </Typography>
          </div>

          <div className="profil_page">
            <div className="img_container_profil">
              <img
                src={!userProfile ? user.avatar : userProfile.avatar}
                className="img_profil"
                alt="image profil"
              />
              {/*a mettre          <img src={userId.attachment} alt="image de l'utilisateur groupomania" />
                    UPLOAD profil_container
                    <p>{errors.maxSize}</p>
                    <p>{errors.format}</p>
              */}
            </div>
            <div className="bio_profil_container">
              <h3>{!userProfile ? user.bio : userProfile.bio}</h3>
              {updateForm === false && !userProfile && (
                <>
                  <p onClick={() => setUpdateForm(!updateForm)}>
                    {userProfile ? userProfile.bio : user.bio}
                  </p>
                 
                  <button
                    className="content_profil_button"
                    onClick={() => setUpdateForm(!updateForm)}
                  >
                    Mettre à jour votre bio
                  </button>
                  <div class="circle"></div>
                </>
              )}
              {!userProfile && <h3></h3>}
              {updateForm && (
                <>
                  <TextareaAutosize
                    defaultValue={user.bio}
                    onChange={e => setBio(e.target.value)}
                    aria-label="minimum height"
                    className="content_profil2"
                    minRows={20}
                    placeholder="Laissez-vous guider par votre imagination..."
                  />

                  <BtnValid
                    onClick={() => setUpdateForm(!updateForm)}
                    action={"SAVE_BIO"}
                    content={bio}
                    user={user}
                  />
                  <div className="signin_profil">
                  {(user.isadmin || !userProfile) && (
                    <BtnDelete
                      action={"DELETE_USER"}
                      data={!userProfile ? uid : userProfile.id}
                      uid={uid}
                    />
                  )}
                  {!userProfile && <UploadImg />}
                </div>
                </>
              )}
            </div>

        
          </div>
        </section>
      )}
      <Footer />
    </>
  );
};