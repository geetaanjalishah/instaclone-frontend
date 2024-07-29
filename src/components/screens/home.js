import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";

const Home = () => {
  const [data, setData] = useState([]);
  const [comment, setComment] = useState(""); // State to store comment text
  const { state } = useContext(UserContext);

  useEffect(() => {
    fetch("https://instaclone-backend-rgh2.onrender.com/allpost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
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

  if (!state) {
    return <div>Loading...</div>; // Ensure state is loaded
  }

  return (
    <div className="home">
      {data.map((item) => {
        if (!item || !item.postedBy) {
          return null; // Skip rendering if item or item.postedBy is null or undefined
        }
        return (
          <div className="card home-card" key={item._id}>
            <h5 style={{ padding: "5px" }}>
              <Link
                to={
                  item.postedBy._id !== state._id
                    ? "/profile/" + item.postedBy._id
                    : "/profile"
                }
              >
                {item.postedBy.name}
              </Link>{" "}
              {item.postedBy._id === state._id && (
                <i
                  className="material-icons"
                  style={{ float: "right" }}
                  onClick={() => deletePost(item._id)}
                >
                  delete
                </i>
              )}
            </h5>
            <div className="card-image">
            <img src={item.photo} alt={`Post by ${item.postedBy.name}`} />
            </div>
            <div className="card-content">
              <i className="material-icons" style={{ color: "red" }}>
                favorite
              </i>
              {item.likes.includes(state._id) ? (
                <i
                  className="material-icons"
                  onClick={() => unlikePost(item._id)}
                >
                  thumb_down
                </i>
              ) : (
                <i className="material-icons" onClick={() => likePost(item._id)}>
                  thumb_up
                </i>
              )}
              <h6>{item.likes.length} likes</h6>
              <h6>{item.title}</h6>
              <p>{item.body}</p>
              {item.comments.map((record) => {
                return (
                  <div key={record._id}>
                    <h6>
                      <span style={{ fontWeight: "500" }}>
                        {record.postedBy.name}
                      </span>{" "}
                      {record.text}
                      {record.postedBy._id === state._id && (
                        <i
                          className="material-icons"
                          style={{
                            fontSize: "1rem",
                            float: "right",
                            cursor: "pointer",
                          }}
                          onClick={() => deleteComment(item._id, record._id)}
                        >
                          delete
                        </i>
                      )}
                    </h6>
                  </div>
                );
              })}
              <div className="comment-input">
                <input
                  type="text"
                  placeholder="add a comment"
                  value={comment} // Bind comment state to input value
                  onChange={handleCommentChange} // Handle input change
                  onKeyPress={(e) => handleKeyPress(e, item._id)} // Handle Enter key press
                />
                <button
                  className="btn waves-effect waves-light #64b5f6 blue darken-1"
                  onClick={() => makeComment(item._id)} // Call makeComment function on button click
                >
                  Add Comment
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
