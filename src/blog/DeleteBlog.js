import React, { Component } from 'react';
import {isLoggedin} from '../member/memberAccount';
import { Redirect } from 'react-router-dom';


class DeleteBlog extends Component {

  state = { goToBlog: false }

  // API call to delete blog
  delete = (blogId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/blog/${blogId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        return res.json()
      })
      .catch(err => console.log(err))
  };

  delBlog = () => {
    const blogId = this.props.blogId;
    const token = isLoggedin().token;
    this.delete(blogId, token).then(data => {
      if (data.error) {
        console.log(data.error)
      } else {
        this.setState({ goToBlog: true })
      }
    })
  }

  confirmDelete = () => {
    let conf = window.confirm("Please confirm that you would like to remove this blog?")
    if (conf) {
      this.delBlog()
    }
  }

  render() {
    if (this.state.goToBlog) {
      return <Redirect to="/blog/all" />
    }
    return (
      <button onClick={this.confirmDelete} className="button">
        Delete Blog
      </button>
    );
  }
}

export default DeleteBlog;