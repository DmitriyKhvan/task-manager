import React, { useRef, useState } from "react";
import Avatar from "@atlaskit/avatar";
import CrossIcon from "@atlaskit/icon/glyph/cross";

import styles from "./selectAvatar.module.scss";

export default function SelectAvatar(): JSX.Element {
  const textInput: any = useRef(null);

  const [searchFieldFlag, setSearchFieldFlag] = useState(true);
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    avatar: "",
    fio: "Хван Дмитрий",
  });

  const [currentUserFio, setCurrentUserFio] = useState(currentUser.fio);
  const [searchUser, setSearchUser] = useState("");
  const [currentUserAvatar, setCurrentUserAvatar] = useState(
    currentUser.avatar
  );

  const [userList, setUserList] = useState([
    {
      id: 0,
      avatar: "",
      fio: "Без назначения",
    },
    {
      id: 1,
      avatar: "",
      fio: "Хван Дмитрий",
    },
    {
      id: 2,
      avatar:
        "https://pbs.twimg.com/profile_images/803832195970433027/aaoG6PJI_400x400.jpg",
      fio: "Иванов Иван",
    },
  ]);

  const addValue = (id: any) => {
    const selectUser: any = userList.find((user) => user.id === id);

    setCurrentUser(selectUser);

    setCurrentUserFio(selectUser.fio);
    setCurrentUserAvatar(selectUser.avatar);

    setSearchFieldFlag(true);
  };

  const searchUsers = (e: any) => {
    const userName = e.target.value;
    setCurrentUserFio(userName);
    setSearchUser(userName);
    setCurrentUserAvatar("");
  };

  const clickUser = (e: any) => {
    setSearchUser("");
    setSearchFieldFlag(false);

    setTimeout(() => {
      // textInput.current.focus();
      textInput.current.select();
      // document.getElementById("outlined-search").select();
    }, 100);
  };

  const onBlurUserField = (e: any) => {
    // debugger;
    setCurrentUserFio(currentUser.fio);
    setCurrentUserAvatar(currentUser.avatar);

    if (!searchFieldFlag) {
      setTimeout(() => {
        setSearchFieldFlag(true);
      }, 100);
    }
  };

  // const removeUserText = (e) => {
  // setCurrentUserFio("");
  // setCurrentUserAvatar("");
  // // setTimeout(() => {
  // //   setSearchFieldFlag(false);
  // //   setTimeout(() => {
  // //     textInput.current.focus();
  // //   }, 100);
  // // }, 100);
  // };

  const stopFocus = (e: any) => {
    // debugger;
    e.preventDefault();
    // debugger;
    setCurrentUserFio("");
    setCurrentUserAvatar("");
    return false;
  };

  return (
    <>
      {searchFieldFlag ? (
        <div className="value">
          <div className={styles.userNameWrap} onClick={clickUser}>
            <Avatar size="small" src={currentUserAvatar}></Avatar>
            <span className={styles.userName}>{currentUserFio}</span>
          </div>
        </div>
      ) : (
        <div className={styles.avatarListWrap}>
          <div className={styles.avatarSelect}>
            <div className={styles.avatarSelectWrap}>
              <span className={styles.avatar}>
                <Avatar size="small" src={currentUserAvatar}></Avatar>
              </span>
              <input
                ref={textInput}
                className={styles.avatarInput}
                value={currentUserFio}
                type="text"
                onChange={searchUsers}
                onBlur={(e) => onBlurUserField(e)}
                placeholder=""
              />

              {/* <TextField
                ref={textInput}
                className={styles.avatarInput}
                value={currentUserFio}
                onChange={searchUsers}
                // onBlur={() => onBlurUserField()}
                id="outlined-search"
                label=""
                type="search"
              /> */}
            </div>
            <div
              // onClick={removeUserText}
              onMouseDown={stopFocus}
              className={styles.removeUserText}
            >
              {/* <CrossIcon label="" size="small" /> */}+
            </div>

            <div className={styles.avatarList}>
              <ul>
                {userList
                  .filter((user) => {
                    console.log(user.fio);
                    return user.fio.includes(searchUser);
                  })
                  .map((user) => {
                    return (
                      <li key={user.id} onClick={() => addValue(user.id)}>
                        <span className={styles.avatarUser}>
                          <Avatar
                            appearance="circle"
                            src={user.avatar}
                            size="medium"
                          ></Avatar>
                        </span>
                        <span className={styles.userName}>{user.fio}</span>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
