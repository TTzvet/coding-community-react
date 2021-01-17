import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { isLoggedin } from '../member/memberAccount';


class CreateEvent extends Component {

  constructor() {
    super()
    this.state = { heading: '', body: '', error: '', member: {}, goToHome: false }
  }

  // API call to create event
  postEvent = (memberId, token, event) => {
    return fetch(`${process.env.REACT_APP_API_URL}/event/new/${memberId}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      },
      body: event
    })
      .then(res => {
        return res.json()
      })
      .catch(err => console.log(err))
  };

  componentDidMount() {
    this.eventData = new FormData();
    this.setState({ member: isLoggedin().member })
  }

  validation = () => {
    if (this.state.heading.length < 5 || this.state.heading.length > 150) {
      this.setState({ error: "Your heading is either too short or too long. Please try again." })
      return false
    } else if (this.state.body.length < 15 || this.state.body.length > 800) {
      this.setState({ error: "Event body is either too short or too long. Please try again." })
      return false
    }
    return true;
  }

  changeInput = name => e => {
    const value = e.target.value;
    this.eventData.set(name, value);
    this.setState({ [name]: value });
  };

  submitEvent = event => {
    event.preventDefault();
    if (this.validation()) {
      const memberId = isLoggedin().member._id;
      const token = isLoggedin().token;

      this.postEvent(memberId, token, this.eventData)
        .then(data => {
          if (data.error) this.setState({ error: data.error })
          else {
            console.log("New event: ", data);
            this.setState({ heading: '', body: '', goToHome: true })
          }
        });
    }
  }

  newEventForm = (heading, body) => (
    <form>
      <div >
        <label >Heading</label>
        <input onChange={this.changeInput("heading")} type="text" value={heading} />
      </div>
      <div >
        <label >Body</label>
        <textarea onChange={this.changeInput("body")} type="text" className="comment" value={body} />
      </div>
      <button onClick={this.submitEvent} className="button"> Post Event </button>
    </form>
  )

  render() {
    if (this.state.goToHome) {
      return <Redirect to={`/event/all`} />;
    }
    return (
      <div className="container">
        <div style={{ textAlign: "left", margintop: "100px", marginBottom: "50px", marginLeft: "105px", marginRight: "105px", backgroundColor: "#e8e8e8", color: "404040", padding: "25px", borderRadius: "15px" }}>
          <h2>Create A New Event</h2><br />
          <div style={{ fontSize: "1.1em" }} >
            <p> Please provide full information about the event including date, time, type and place of the event. </p>
            <p> Please note that the admin may contact you to discuss this event further. </p>
          </div>
        </div>
        {this.newEventForm(this.state.heading, this.state.body)}
        <div style={{ display: this.state.error ? "" : "none" }}>
          {this.state.error}
        </div>
      </div>
    );
  }
}

export default CreateEvent;