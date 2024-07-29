import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";

const Home = () => {
  const [data, setData] = useState([]);
  const [comment, setComment] = useState(""); // State to store comment text
  const { state } = useContext(UserContext);

  useEffect(() => {
    fetch("https://instaclone-backend-rgh2.onrender.com/getsubpost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setData(result.posts || []);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const likePost = (postId) => {
    fetch("https://instaclone-backend-rgh2.onrender.com/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: postId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const unlikePost = (postId) => {
    fetch("https://instaclone-backend-rgh2.onrender.com/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: postId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value); // Update comment state on input change
  };

  const makeComment = (postId) => {
    fetch("https://instaclone-backend-rgh2.onrender.com/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        text: comment, // Pass comment text to the backend
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
        setComment(""); // Clear comment input after submission
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleKeyPress = (e, postId) => {
    if (e.key === "Enter") {
      makeComment(postId); // Call makeComment function when Enter key is pressed
    }
  };

  const deletePost = (postId) => {
    fetch(`https://instaclone-backend-rgh2.onrender.com/deletepost/${postId}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
      });
  };

  const deleteComment = (postId, commentId) => {
    fetch(`https://instaclone-backend-rgh2.onrender.com/deletecomment/${postId}/${commentId}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.error("Error deleting comment:", err);
      });
  };

  return (
    <div className="home">
      {data.map((item) => {
        return (
          <div className="card home-card" key={item._id}>
          <h5 style={{padding:"5px"}}><Link to={item.postedBy._id !== state._id?"/profile/"+item.postedBy._id :"/profile"  }>{item.postedBy.name}</Link> {item.postedBy._id === state._id 
            && <i
                  className="material-icons"
                  style={{ float: "right" }}
                  onClick={() => deletePost(item._id)}
                >
                  delete
                </i>
              }
            </h5>
            <div className="card-image">
              <img src={item.photo} alt="post" />
            </div>
            <div className="card-content">
              <i className="material-icons" style={{ color: "red" }}>
                favorite
              </i>
              {/* Like/Unlike logic */}
              {item.likes.includes(state._id) ? (
                <i
                  className="material-icons"
                  onClick={() => unlikePost(item._id)}
                >
                  thumb_down
                </i>
              ) : (
                <i
                  className="material-icons"
                  onClick={() => likePost(item._id)}
                >
                  thumb_up
                </i>
              )}
              <h6>{item.likes.length}likes</h6>
              <h6>{item.title}</h6>
              <p>{item.body}</p>

              {/* Comment section */}
              {item.comments.map((record) => {
                return (
                  <div key={record._id}>
                    <span style={{ fontWeight: "500" }}>
                      {record.postedBy.name}
                    </span>
                    {record.text}
                    {record.postedBy._id === state._id && (
                      <i
                        className=" tiny material-icons"
                        style={{ float: "right" }}
                        onClick={() => deleteComment(item._id, record._id)}
                      >
                        delete
                      </i>
                    )}
                  </div>
                );
              })}

              {/* Comment input field */}
              <input
                type="text"
                placeholder="add a comment"
                value={comment}
                onChange={handleCommentChange}
                onKeyDown={(e) => handleKeyPress(e, item._id)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
