import React, { Component } from 'react';
import BlogImage from '../images/blog.jpg';
import { Link } from 'react-router-dom';
import { isLoggedin } from '../member/memberAccount';
const NoShadow = { boxShadow: 'none' };

export class ReadAllBlogs extends Component {
  constructor() {
    super()
    this.state = { blogs: [] }
  }

  // API call to get all blogs
  getAll = () => {
    return fetch(`${process.env.REACT_APP_API_URL}/blog/all`, {
      method: "GET",
    })
      .then(res => {
        return res.json()
      })
      .catch(err => console.log(err))
  }

  componentDidMount() {
    this.getAll().then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ blogs: data })
      }
    });
  }

  renderBlogs = blogs => {
    return (
      <div className="row">
        {blogs.map((blog, i) => {
          const authorId = blog.author ? `/member/${blog.author._id}` : "";
          const authorName = blog.author ? blog.author.name : " Unknown";

          return (
            <div className="col-md-12" key={i} style={{ border: "1px solid #e8e8e8", marginTop: "10px", borderRadius: "15px" }}>
              <div >
                <div className="row">
                  <div className="col-md-4">
                    <img src={`${process.env.REACT_APP_API_URL
                      }/blog/image/${blog._id}`}
                      alt={blog.heading}
                      onError={e => (e.target.src = `${BlogImage}`)}
                      style={{ height: "200px", width: "100%" }} />
                  </div>
                  <div className="col-md-8">
                    <h4 >{blog.heading}</h4>
                    <p >{blog.body.substring(0, 290)}</p>
                    <br />
                    <p style={{ fontStyle: "italic" }}> Author
                <Link to={`${authorId}`} style={{ color: "#2196F3" }}> {authorName} {" "} </Link>
                  on {new Date(blog.created).toDateString()}
                    </p>
                    <div className="row">
                      <div className="col-md-8" style={NoShadow}></div>
                      <div className="col-md-4" style={{ textAlign: "right" }}>
                        <Link to={`/blog/${blog._id}`} className="button" style={{ marginBottom: "10px" }}> More </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    return (
      <div>
        <div style={{ textAlign: "left", margintop: "100px", marginBottom: "50px", marginLeft: "105px", marginRight: "105px", backgroundColor: "#e8e8e8", color: "404040", padding: "25px", borderRadius: "15px" }}>
          <h2>Women&apos;s Coding Community - Blog</h2><br />
          <div style={{ fontSize: "1.1em" }} >
            <p> Welcome to our community blog! Here you will find useful information shared by our members - both professionals as well as aspiring members are sharing their knowledge, experience, concerns and anything else they think you should know about a career in coding. </p>
            <p> Browse through our blogs and feel free to share your thoughts underneath the blogs. <strong>Comments are available for members only.</strong> </p>
          </div>
          <div>
            {isLoggedin() && (
              <button>
                <Link to={`/blog/new`} className="button"> NEW BLOG
                </Link>
              </button>
            )}
          </div>
        </div>
        <div className="container">
          <h2 style={{ marginTop: "50px", marginBottom: "50px", textAlign: "center" }}>Community&apos;s Blog Posts</h2>
          {this.renderBlogs(this.state.blogs)}
        </div>
      </div>
    );
  }
}

export default ReadAllBlogs;