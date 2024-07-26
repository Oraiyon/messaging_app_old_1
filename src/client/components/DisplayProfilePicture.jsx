import Icon from "@mdi/react";
import { mdiAccountCircle, mdiPencilCircleOutline } from "@mdi/js";
import styles from "../stylesheets/DisplayProfilePicture.module.css";
import { useRef } from "react";

const DisplayProfilePicture = (props) => {
  const formRef = useRef(null);
  const editPictureIconRef = useRef(null);

  const changeProfilePicture = async (e) => {
    try {
      e.preventDefault();
      if (formRef.current.value) {
        const formData = new FormData();
        formData.append("file", formRef.current.files[0]);
        const fetchUser = await fetch(`/api/${user._id}/profile/account/picture`, {
          method: "POST",
          body: formData
        });
        const data = await fetchUser.json();
        setUser(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const displayEditPictureRef = (ref) => {
    if (props.user) {
      if (!ref.current.style.display || ref.current.style.display === "none") {
        ref.current.style.display = "flex";
      } else {
        ref.current.style.display = "none";
      }
    }
  };

  const openPictureForm = () => {
    formRef.current.children[1].click();
  };

  const ProfilePictureForm = () => {
    if (props.user) {
      return (
        <form
          action=""
          onSubmit={changeProfilePicture}
          ref={formRef}
          className={styles.profile_picture_form}
        >
          <label htmlFor="picture">Edit Profile Picture</label>
          <input type="file" name="picture" id="picture" />
          <button>Submit</button>
        </form>
      );
    }
  };

  // Make profile.picture default to default pic?
  if (props.profile.picture) {
    return (
      <>
        <ProfilePictureForm />
        <div
          className={props.user ? "user_picture_container" : styles.profile_picture_container}
          onClick={openPictureForm}
          onMouseOver={() => displayEditPictureRef(editPictureIconRef)}
          onMouseOut={() => displayEditPictureRef(editPictureIconRef)}
        >
          <img
            src={props.profile.picture}
            alt="Profile Picture"
            title={props.user ? "Change Profile Picture" : ""}
            className={props.user ? styles.user_profile_picture : styles.profile_picture}
          />
          <Icon
            path={mdiPencilCircleOutline}
            className={styles.edit_picture_icon}
            ref={editPictureIconRef}
          />
        </div>
      </>
    );
  } else {
    return (
      <>
        <ProfilePictureForm />
        <div
          className={props.user ? "user_picture_container" : styles.profile_picture_container}
          onClick={openPictureForm}
          onMouseOver={() => displayEditPictureRef(editPictureIconRef)}
          onMouseOut={() => displayEditPictureRef(editPictureIconRef)}
        >
          <div className={styles.default_profile_picture}>
            <Icon
              path={mdiAccountCircle}
              className={props.user ? styles.user_profile_picture : styles.profile_picture}
              title="Change Profile Picture"
            />
          </div>
          <Icon
            path={mdiPencilCircleOutline}
            className={styles.edit_picture_icon}
            ref={editPictureIconRef}
          />
        </div>
      </>
    );
  }
};

export default DisplayProfilePicture;
