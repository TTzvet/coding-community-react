import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { memberEvent } from './memberEvent';
import { isLoggedin } from '../member/memberAccount';
import DeleteEvent from './DeleteEvent'

class ReadEvent extends Component {
  state = { event: "", goToForum: false, goToLogin: false, interest: false, interests: 0 }

  // API calls interest/no interest
  interest = (memberId, token, eventId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/event/interest`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ memberId, eventId })
    })
      .then(res => {
        return res.json()
      })
      .catch(err => console.log(err))
  };

  nointerest = (memberId, token, eventId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/event/nointerest`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ memberId, eventId })
    })
      .then(res => {
        return res.json()
      })
      .catch(err => console.log(err))
  };

  matchInterest = (interests) => {
    const memberId = isLoggedin() && isLoggedin().member._id;
    let match = interests.indexOf(memberId) !== -1
    return match;
  }

  componentDidMount = () => {
    const eventId = this.props.match.params.eventId;
    memberEvent(eventId).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          event: data,
          interests: data.interests.length,
          interest: this.matchInterest(data.interests),
        });
      }
    });
  };

  interestTab = () => {
    if (!isLoggedin()) {
      this.setState({ goToLogin: true })
      return false;
    }
    let apiReq = this.state.interest ? this.nointerest : this.interest
    const memberId = isLoggedin().member._id;
    const eventId = this.state.event._id;
    const token = isLoggedin().token;
    apiReq(memberId, token, eventId).then(data => {
      if (data.error) {
        console.log(data.error)
      } else {
        this.setState({
          interest: !this.state.interest,
          interests: data.interests.length
        })
      }
    })
  }

  renderEvent = event => {
    const authorId = event.author ? `/member/${event.author._id}` : "";
    const authorName = event.author ? event.author.name : " Unknown";

    const { interest } = this.state
    return (

      <div >

        <p >{event.body}</p>
        <br />
        <div style={{ textAlign: "right" }}>
          {interest ? (
            <h3 onClick={this.interestTab} style={{ color: "#2196F3", cursor: "pointer" }} >{this.state.interests} Interested </h3>
          ) : (
              <h3 onClick={this.interestTab} style={{ color: "#2196F3", cursor: "pointer" }}>{this.state.interests} Interested </h3>
            )}
        </div>
        <hr />
        <p style={{ fontStyle: "italic", textAlign: "right" }}>
          Author <Link to={`${authorId}`} style={{ color: "#2196F3" }}> {authorName} {" "} </Link>
          on {new Date(event.created).toDateString()}
        </p>
        <div style={{ textAlign: "right" }} >
          <Link to={`/event/all`} className="button" >
            Back to events
        </Link>
          {isLoggedin().member &&
            isLoggedin().member._id === event.author._id &&
            <>
              <Link to={`/event/update/${event._id}`} className="button"> Edit Event</Link>
              <DeleteEvent eventId={event._id} />
            </>
          }
        </div>
      </div>
    );
  }

  render() {
    const { event } = this.state
    if (this.state.goToForum) {
      return <Redirect to={`/event/all`} />;
    } else if (this.state.goToLogin) {
      return <Redirect to={`/login`} />;
    }
    return (
      <div className="container">
        <h2 style={{ marginTop: "100px", fontSize: "2.4em" }}>{event.heading}</h2>
        <hr />
        {!event ? (
          <div style={{ textAlign: "left", margintop: "100px", marginBottom: "50px", marginLeft: "105px", marginRight: "105px", backgroundColor: "#e8e8e8", color: "404040", padding: "25px", borderRadius: "15px" }}>
            <h2>Please wait while the page loads.</h2>
          </div>
        ) : (
            this.renderEvent(event)
          )}
      </div>
    )
  }
}

export default ReadEvent;