import React, { Component } from 'react';
import { isLoggedin } from '../member/memberAccount';
import { Redirect } from 'react-router-dom';


class DeleteEvent extends Component {

  state = { goToForum: false }

  // API call to delete event
  delete = (eventId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/event/${eventId}`, {
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

  delEvent = () => {
    const eventId = this.props.eventId;
    const token = isLoggedin().token;
    this.delete(eventId, token).then(data => {
      if (data.error) {
        console.log(data.error)
      } else {
        this.setState({ goToForum: true })
      }
    })
  }

  confirmDelete = () => {
    let conf = window.confirm("Please confirm that you would like to remove this event?")
    if (conf) {
      this.delEvent()
    }
  }

  render() {
    if (this.state.goToForum) {
      return <Redirect to="/event/all" />
    }
    return (
      <button onClick={this.confirmDelete} className="button"> Delete Event </button>
    );
  }
}

export default DeleteEvent;