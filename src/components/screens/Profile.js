import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";

const Profile = () => {
  const [mypics, setPics] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const [image, setImage] = useState("");

  useEffect(() => {
    fetch("https://instaclone-backend-rgh2.onrender.com/mypost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setPics(result.mypost);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    if (image) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "insta-clone");
      data.append("cloud_name", "geetaanjalishah");
      fetch("https://api.cloudinary.com/v1_1/geetaanjalishah/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          fetch("/updatepic", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
              pic: data.url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              localStorage.setItem("user", JSON.stringify({ ...state, pic: result.pic }));
              dispatch({ type: "UPDATEPIC", payload: result.pic });
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [dispatch, image, state]);

  const updatePhoto = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  return (
    <div style={{ maxWidth: "550px", margin: "0 auto" }}>
      <div style={{ margin: "18px 0", borderBottom: "1px solid grey" }}>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <div>
            <img
              style={{ width: "160px", height: "160px", borderRadius: "80px" }}
              src={state ? state.pic : "loading"}
              alt="Profile"
            />
          </div>
          <div>
            <h4>{state ? state.name : "loading"}</h4>
            <div style={{ display: "flex", justifyContent: "space-between", width: "108%" }}>
              <h6>{mypics.length} posts</h6>
              <h6>{state && state.followers ? state.followers.length : "0"} followers</h6>
              <h6>{state && state.following ? state.following.length : "0"} following</h6>
            </div>
          </div>
        </div>
        <div className="file-field input-field" style={{ margin: "10px" }}>
          <div className="btn #64b5f6 blue darken-1">
            <span>Upload DP</span>
            <input type="file" onChange={updatePhoto} />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
      </div>
      <div className="gallery">
        {mypics.map((item) => (
          <img key={item._id} className="item" src={item.photo} alt={item.title} />
        ))}
      </div>
    </div>
  );
};

export default Profile;
