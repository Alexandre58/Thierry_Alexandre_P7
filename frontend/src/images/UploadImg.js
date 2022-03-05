import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadPicture } from "../actions/user.actions";
import "../style/upload.scss";

const UploadImg = () => {
  
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const userId = useSelector(state => state.userReducer);
  console.log(userId);
  const handlePicture = e => {
    e.preventDefault();
    var data = new FormData();
    data.append("image", file);
    dispatch(uploadPicture(data, userId.id));
  };
  return (
    <>
      <form action="" onSubmit={handlePicture} className="upload_img_profil">
        {/*   <label  className="content_profil_label"  htmlFor="file">Click pour changer votre image</label>*/}
        <input
          className="content_profil_input"
          type="file"
          id="file"
          name="file"
          accept=".jpg, .jpeg, .png, .gif"
          onChange={e => setFile(e.target.files[0])}
        />

        <br />
        <input
          className="content_profil_input"
          type="submit"
          value="Mis a jour de l'image"
        />
      </form>
    </>
  );
};

export default UploadImg;