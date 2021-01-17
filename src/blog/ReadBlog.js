import React, { Component } from 'react';
import BlogImage from '../images/blog.jpg';
import Answer from './Answer';
import DeleteBlog from './DeleteBlog';
import { Link, Redirect } from 'react-router-dom';
import { memberBlog } from './memberBlog';
import { isLoggedin } from '../member/memberAccount';


class ReadBlog extends Component {
  state = { blog: "", goToBlog: false, goToLogin: false, answers: [] }

  updateAnswers = answers => {
    this.setState({ answers: answers })
  }

  componentDidMount = () => {
    const blogId = this.props.match.params.blogId;
    memberBlog(blogId).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          blog: data,
          answers: data.answers
        });
      }
    });
  };

  renderBlog = blog => {
    const posterId = blog.author ? `/member/${blog.author._id}` : "";
    const posterName = blog.author ? blog.author.name : " Unknown";

    return (

      <div>
        <p style={{ textAlign: "center", fontStyle: "italic", color: "#2196F3" }}>
          Author <Link to={`${posterId}`} style={{ fontStyle: "italic", color: "#2196F3" }}> {posterName} {" "}
          </Link>
          on {new Date(blog.created).toDateString()}
        </p>
        <br />
        <div>
          <p>
            <img src={`${process.env.REACT_APP_API_URL}/blog/image/${blog._id}`}
              alt={blog.heading} onError={i => (i.target.src = `${BlogImage}`)}
              style={{ height: "250px", width: "40%", float: 'left', marginRight: "70px" }}/>
            <div style={{ textAlign: "justify" }}> {blog.body} </div>
          </p>
        </div>
        <br />
        <br />
        <hr />
        <div style={{ textAlign: "right" }}>
          <Link to={`/blog/all`} className="button">
            Back to blogs
          </Link>
          {isLoggedin().member &&
            isLoggedin().member._id === blog.author._id &&
            <>
              <Link to={`/blog/update/${blog._id}`} className="button"> Edit Blog </Link>
              <DeleteBlog blogId={blog._id} />
            </>
          }
        </div>
      </div>
    );
  }

  render() {
    const { blog } = this.state
    if (this.state.goToBlog) {
      return <Redirect to={`/blog/all`} />;
    } else if (this.state.goToLogin) {
      return <Redirect to={`/login`} />;
    }
    return (
      <div className="container">
        <div style={{ textAlign: "center", marginTop: "100px", marginBottom: "25px", fontSize: "3.5em" }}>
          {blog.heading}
          <hr />
        </div>
        {!blog ? (
          <div style={{ textAlign: "left", margintop: "100px", marginBottom: "50px", marginLeft: "105px", marginRight: "105px", backgroundColor: "#e8e8e8", color: "404040", padding: "25px", borderRadius: "15px" }}>
            <h2>Please wait while the page loads.</h2>
          </div>
        ) : (
            this.renderBlog(blog)
          )}

        <Answer
          blogId={blog._id}
          answers={this.state.answers}
          updateAnswers={this.updateAnswers} />
      </div>
    )
  }
}

export default ReadBlog;