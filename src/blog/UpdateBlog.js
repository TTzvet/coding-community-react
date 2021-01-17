import React, { Component } from 'react';
import { isLoggedin } from '../member/memberAccount';
import { Redirect } from 'react-router-dom';
import { memberBlog } from './memberBlog';
import BlogImage from '../images/blog.jpg';

class UpdateBlog extends Component {
  constructor() {
    super()
    this.state = { id: '', heading: '', body: '', goToHome: false, error: '', sizeImage: 0 }
  }

  // API call to update blog
  blogUpdate = (blogId, token, blog) => {
    console.log(blogId, token, blog);
    return fetch(`${process.env.REACT_APP_API_URL}/blog/${blogId}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      },
      body: blog
    })
      .then(res => {
        return res.json()
      })
      .catch(err => console.log(err))
  };

  inState = blogId => {
    memberBlog(blogId).then(data => {
      if (data.error) {
        //console.log("error message");
        this.setState({ goToHome: true });
      } else {
        //console.log(data);
        this.setState({ id: data._id, heading: data.heading, body: data.body, error: "" });
      }
    })
  }

  componentDidMount() {
    this.blogData = new FormData();
    // console.log("member id route params: ", this.props.match.params.memberId)
    const blogId = this.props.match.params.blogId;
    this.inState(blogId);
  }

  validation = () => {
    if (this.state.sizeImage > 500000) {
      this.setState({
        error: "Please upload a photo which is no more than 500kb",
      });
      return false;
    }
    if (this.state.heading.length < 5 || this.state.heading.length > 150) {
      this.setState({ error: "Blog's heading is either too short or too long. Please try again." })
      return false
    } else if (this.state.body.length < 500 || this.state.body.length > 2000) {
      this.setState({ error: "Blog's body is either too short or too long. Please try again." })
      return false
    }
    return true;
  }

  changeInput = name => e => {
    const value = name === "photo" ? e.target.files[0] : e.target.value;

    const sizeImage = name === "photo" ? e.target.files[0].size : 0;
    this.blogData.set(name, value);
    this.setState({ [name]: value, sizeImage: sizeImage });
  };

  submitInput = event => {
    event.preventDefault();
    if (this.validation()) {
      const blogId = this.state.id;
      const token = isLoggedin().token;

      this.blogUpdate(blogId, token, this.blogData)
        .then(data => {
          if (data.error) this.setState({ error: data.error })
          else {
            this.setState({ heading: '', body: '', goToHome: true })
          }
        });
    }
  }

  editBlogForm = (heading, body) => (
    <form>
      <div>
        <label>Blog Image</label>
        <br />
        <input onChange={this.changeInput("photo")} type="file" accept="image/*" />
      </div>
      <br />
      <div>
        <label>Heading</label>
        <input onChange={this.changeInput("heading")} type="text" value={heading} />
      </div>
      <br />
      <div>
        <label >Body</label>
        <textarea onChange={this.changeInput("body")} type="text" className="comment" value={body} />
      </div>
      <button onClick={this.submitInput} className="button"> Update Blog </button>
    </form>
  )

  render() {
    const { id, heading} = this.state
    if (this.state.goToHome) {
      return <Redirect to={`/blog/all`} />;
    }
    return (
      <div className="container">
        <h2 style={{ marginTop: "100px", marginBottom: "60px" }}>{heading}</h2>
        <img style={{ height: "200px", width: "auto" }} src={`${process.env.REACT_APP_API_URL}/blog/image/${id}??${new Date().getTime()}`}
          onError={i => (i.target.src = `${BlogImage}`)} alt={heading} /> 
          {this.editBlogForm(heading, this.state.body)}
        <div style={{ display: this.state.error ? "" : "none" }}>
          {this.state.error}
        </div>
      </div>
    )
  }
}

export default UpdateBlog;