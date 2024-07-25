import Icon from "@mdi/react";
import { mdiAccountCircle, mdiPencilCircleOutline } from "@mdi/js";
import styles from "../stylesheets/DisplayProfilePicture.module.css";
import { useRef } from "react";

const DisplayProfilePicture = (props) => {
  const form = useRef(null);
  const editPictureIcon = useRef(null);

  const changeProfilePicture = async (e) => {
    try {
      e.preventDefault();
      if (form.current.value) {
        const formData = new FormData();
        formData.append("file", form.current.files[0]);
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

  const displayEditPicture = (ref) => {
    if (props.user) {
      if (!ref.current.style.display || ref.current.style.display === "none") {
        ref.current.style.display = "flex";
      } else {
        ref.current.style.display = "none";
      }
    }
  };

  const ProfilePictureForm = () => {
    if (props.user) {
      return (
        <form action="" onSubmit={changeProfilePicture} ref={form}>
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
      <div className={styles.user_profile_picture_container}>
        <ProfilePictureForm />
        <img
          src={props.profile.picture}
          alt="Profile Picture"
          title="Change Profile Picture"
          className={props.user ? styles.user_profile_picture : styles.profile_picture}
          onClick={() => displayEditPicture(form)}
          onMouseOver={() => displayEditPicture(editPictureIcon)}
          onMouseOut={() => displayEditPicture(editPictureIcon)}
        />
        <Icon
          path={mdiPencilCircleOutline}
          className={styles.edit_picture_icon}
          ref={editPictureIcon}
        />
      </div>
    );
  } else {
    return (
      <div className={styles.default_profile_picture_container}>
        <ProfilePictureForm />
        <Icon
          path={mdiAccountCircle}
          className={props.user ? styles.user_profile_picture : styles.profile_picture}
          title="Change Profile Picture"
          onClick={() => displayEditPicture(form)}
        />
      </div>
    );
  }
};

export default DisplayProfilePicture;
