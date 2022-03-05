
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPost, addPost2, getPosts } from "../actions/post.action";
import { isEmpty } from "../components/Utils";
import UploadImg from "../images/UploadImg";

//scss blog.js
import "../style/btnDeleteandMody.scss";
import "../style/formPost.scss";

const FormPost = ({ user }) => {
  var data2 = new FormData();

  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const userId = useSelector(state => state.userReducer);
  console.log(userId);
  /*const handlePicture = e => {
    e.preventDefault();
    var data = new FormData();
    data.append("image", file);
    dispatch(uploadPicture(data, userId.id));
  };*/

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  //if not emply
  const handleForm = async e => {
    e.preventDefault();
    if (title && content) {
      const data = {
        title: title,
        content: content,
      };
      if (!file) await dispatch(addPost(data));
      else {
        data2.append("image", file);
        data2.append("title", title);
        data2.append("content", content);
        dispatch(addPost2(data2));
      }
      setTitle("");
      setContent("");
    }
  };

  return (
    <>
      <form className="form_mediaCard" onSubmit={e => handleForm(e)}>
        <p className="p_form_mediaCard">
          Vous pouvez créer votre message ici {!isEmpty(user) && user.firstname}
        </p>
        <input
          className="input_title_mediaCard"
          type="text"
          placeholder="Titre de votre message :"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          className="input_post_mediaCard"
          placeholder="dites nous en plus sur vous ..."
          value={content}
          onChange={e => setContent(e.target.value)}
        ></textarea>
        <div className="upload_img_profil">
          {/*   <label  className="content_profil_label"  htmlFor="file">Click pour changer votre image</label>*/}
          <input
            className="content_profil_input"
            type="file"
            id="file"
            name="file"
            accept=".jpg, .jpeg, .png, .gif"
            onChange={e => setFile(e.target.files[0])}
          />
        </div>
        <div className="btnDeleteAndMofified_FormPost_container">
          <input
            className="input_button_mediaCard"
            type="submit"
            value="Envoyer"
          />
        </div>
      </form>
    </>
  );
};

export default FormPost;