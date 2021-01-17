import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { isLoggedin } from '../member/memberAccount';


class CreateBlog extends Component {

  constructor() {
    super()
    this.state = { heading: '', body: '', photo: '', error: '', member: {}, sizeImage: 0, goToHome: false }
  }

  // API call to create a new blog post
  postBlog = (memberId, token, blog) => {
    return fetch(`${process.env.REACT_APP_API_URL}/blog/new/${memberId}`, {
      method: "POST",
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

  componentDidMount() {
    this.blogData = new FormData();
    this.setState({ member: isLoggedin().member })
  }

  validation = () => {
    if (this.state.sizeImage > 500000) {
      this.setState({
        error: "Please upload a file which is no more than 500kb",
      });
      return false;
    }
    if (this.state.heading.length < 5 || this.state.heading.length > 150) {
      this.setState({ error: "Your heading is either too short or too long. Please try again." })
      return false
    } else if (this.state.body.length < 500 || this.state.body.length > 2000) {
      this.setState({ error: "Blog body is either too short or too long. Please try again." })
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

  submitBlog = e => {
    e.preventDefault();
    if (this.validation()) {
      const memberId = isLoggedin().member._id;
      const token = isLoggedin().token;

      this.postBlog(memberId, token, this.blogData)
        .then(data => {
          if (data.error) this.setState({ error: data.error })
          else {
            console.log("New blog: ", data);
            this.setState({
              heading: '',
              body: '',
              goToHome: true
            })
          }
        });
    }
  }

  newBlogForm = (heading, body) => (
    <form>
      <div >
        <label >Add a photo (optional)</label>
        <br />
        <input onChange={this.changeInput("photo")} type="file" accept="image/*" />
      </div>
      <br />
      <div >
        <label >Heading</label>
        <input onChange={this.changeInput("heading")} type="text" value={heading} />
      </div>
      <div>
        <label >Body</label>
        <textarea onChange={this.changeInput("body")} type="text" className="comment" value={body} />
      </div>
      <button onClick={this.submitBlog} className="button"> Post Blog </button>
    </form>
  )

  render() {
    if (this.state.goToHome) {
      return <Redirect to={`/blog/all`} />;
    }
    return (
      <div className="container">
        <div style={{ textAlign: "left", margintop: "100px", marginBottom: "50px", marginLeft: "105px", marginRight: "105px", backgroundColor: "#e8e8e8", color: "404040", padding: "25px", borderRadius: "15px" }}>
          <h2>Create a New Post In Our Blog</h2><br />
          <div style={{ fontSize: "1.1em" }} >
            <p> While we don't have any specific requirements about which topic you choose to write about, please make sure that it has some relation to career in coding. </p>
            <p> Please note minimum requirement for the blog post is 500 characters long. </p>
          </div>
        </div>
        {this.newBlogForm(this.state.heading, this.state.body)}
        <div style={{ display: this.state.error ? "" : "none" }}>
          {this.state.error}
        </div>
      </div>
    );
  }
}

export default CreateBlog;