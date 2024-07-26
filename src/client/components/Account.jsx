import { useOutletContext } from "react-router-dom";
import styles from "../stylesheets/Account.module.css";
import { useRef, useState } from "react";
import Header from "./Header";
import DisplayProfilePicture from "./DisplayProfilePicture";

const Account = () => {
  const [
    user,
    setUser,
    foundUser,
    setFoundUser,
    currentChat,
    setCurrentChat,
    currentMessages,
    setCurrentMessages,
    searchUserInput,
    sidebarContainer
  ] = useOutletContext();

  const [searchedFriend, setSearchedFriend] = useState(null);

  const cancelEditNameButton = useRef(null);
  const editName = useRef(null);
  const editNameButton = useRef(null);
  const submitNameButton = useRef(null);
  const invalidUsername = useRef(null);
  const friendsList = useRef(null);
  // const form = useRef(null);

  const displayEditName = () => {
    if (!editName.current.style.display || editName.current.style.display === "none") {
      cancelEditNameButton.current.style.display = "flex";
      editName.current.style.display = "flex";
      editNameButton.current.style.display = "none";
      submitNameButton.current.style.display = "flex";
    } else {
      cancelEditNameButton.current.style.display = "none";
      editName.current.style.display = "none";
      editName.current.value = "";
      editNameButton.current.style.display = "flex";
      submitNameButton.current.style.display = "none";
      invalidUsername.current.style.display = "none";
    }
  };

  const submitEditName = async () => {
    if (!editName.current.value || editName.current.value.length < 3) {
      invalidUsername.current.style.display = "flex";
      return;
    }
    const fetchUser = await fetch(`/api/${user._id}/profile/account/username`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ editName: editName.current.value })
    });
    const res = await fetchUser.json();
    if (res) {
      setUser(res);
      displayEditName();
    } else {
      invalidUsername.current.style.display = "flex";
    }
  };

  const removeFriend = async (friend) => {
    try {
      // Use body instead of url?
      const fetchUser = await fetch(`/api/friend/${user._id}/${friend._id}`, {
        method: "PUT"
      });
      const data = await fetchUser.json();
      setUser(data);
      if (!data.friends.length) {
        setCurrentChat(null);
      } else {
        setCurrentChat(data.friends[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const searchFriendAccount = async (e) => {
    try {
      if (e.target.value) {
        friendsList.current.style.display = "none";
        for (const friend of user.friends) {
          if (e.target.value === friend.username) {
            setSearchedFriend(friend);
            return;
          } else {
            setSearchedFriend(null);
          }
        }
      } else {
        friendsList.current.style.display = "block";
        setSearchedFriend(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const FriendInputs = (props) => {
    return (
      <div className={styles.friend_account}>
        <div>
          <DisplayProfilePicture profile={props.friend} />
          <p>{props.friend.username}</p>
        </div>
        <button onClick={() => removeFriend(props.friend)}>Remove</button>
      </div>
    );
  };

  const DisplaySearchedFriend = () => {
    if (searchedFriend) {
      return <FriendInputs friend={searchedFriend} />;
    }
  };

  // const changeProfilePicture = async (e) => {
  //   try {
  //     e.preventDefault();
  //     if (form.current.value) {
  //       const formData = new FormData();
  //       formData.append("file", form.current.files[0]);
  //       const fetchUser = await fetch(`/api/${user._id}/profile/account/picture`, {
  //         method: "POST",
  //         body: formData
  //       });
  //       const data = await fetchUser.json();
  //       setUser(data);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const setProfilePictureToDefault = async () => {
    try {
      if (user.picture) {
        const fetchUser = await fetch(`/api/${user._id}/profile/account/picture`, {
          method: "PUT"
        });
        const data = await fetchUser.json();
        setUser(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const SetToDefaultPicture = () => {
    if (user.picture) {
      return (
        <button className={styles.default_picture_button} onClick={setProfilePictureToDefault}>
          Set Picture To Default
        </button>
      );
    }
  };

  return (
    <>
      <Header
        user={user}
        setFoundUser={setFoundUser}
        searchUserInput={searchUserInput}
        account={true}
        sidebarContainer={sidebarContainer}
      />
      <div className={styles.account_container}>
        <div className={styles.edits}>
          <SetToDefaultPicture />
          <div className={styles.edit_name_inputs}>
            <button
              onClick={displayEditName}
              className={styles.cancel_edit_name}
              ref={cancelEditNameButton}
            >
              Cancel
            </button>
            <div>
              <label htmlFor="editName">Edit Name</label>
              <input
                type="text"
                id="editName"
                name="editName"
                placeholder={user.username}
                className={styles.new_name}
                ref={editName}
              />
              <p className={styles.username_taken_warning} ref={invalidUsername}>
                Invalid username
              </p>
            </div>
            <button onClick={displayEditName} ref={editNameButton}>
              Edit Name
            </button>
            <button onClick={submitEditName} className={styles.submit_name} ref={submitNameButton}>
              Submit
            </button>
          </div>
          <DisplayProfilePicture profile={user} user={true} />
          <h3>{user.username}</h3>
        </div>
        <div className={styles.friendsList_account}>
          <label htmlFor="searchFriend">Search Friend</label>
          <input
            type="text"
            name="friend"
            id="searchFriend"
            placeholder="Search Friend"
            onChange={searchFriendAccount}
          />
          <DisplaySearchedFriend />
          <div ref={friendsList} className={styles.friends_list}>
            {user.friends.map((friend) => (
              <div key={friend._id}>
                <FriendInputs friend={friend} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Account;
