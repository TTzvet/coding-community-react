import React, { Component } from 'react';
import { isLoggedin } from '../member/memberAccount';
import { Redirect, Link } from 'react-router-dom';
import { logout } from '../member/memberAccount';


class DeleteMember extends Component {

  state = { goToHome: false}

  // API call delete member
  delMember = (memberId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/member/${memberId}`, {
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

  confirmDeleted = () => {
    //console.log("delete account");
    const token = isLoggedin().token;
    const memberId = this.props.memberId
    this.delMember(memberId, token)
      .then(data => {
        if (data.error) {
          console.log(data.error)
        } else {
          logout(() => console.log("This account has been removed"));
          this.setState({ goToHome: true })
        }
      })
  }

  confirmDeletion = () => {
    let answer = window.confirm("Please confirm that you would like to cancel your membership")
    if (answer) {
      this.confirmDeleted()
    }
  }

  render() {
    if (this.state.goToHome) {
      return <Redirect to="/" />
    }
    return (
      <Link onClick={this.confirmDeletion} className="button"> Close Account </Link>
    );
  }
}

export default DeleteMember;