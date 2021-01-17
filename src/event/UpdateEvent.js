import React, { Component } from 'react';
import { isLoggedin } from '../member/memberAccount';
import { Redirect } from 'react-router-dom';
import { memberEvent } from './memberEvent';


class UpdateEvent extends Component {
  constructor() {
    super()
    this.state = { id: '', heading: '', body: '', gotToHome: false, error: '' }
  }

  // API call update event
  eventUpdate = (eventId, token, event) => {
    console.log(eventId, token, event);
    return fetch(`${process.env.REACT_APP_API_URL}/event/${eventId}`, {
      method: "PUT",
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

  inState = eventId => {
    memberEvent(eventId).then(data => {
      if (data.error) {
        //console.log("error message");
        this.setState({ gotToHome: true });
      } else {
        //console.log(data);
        this.setState({ id: data._id, heading: data.heading, body: data.body, error: "" });
      }
    })
  }

  componentDidMount() {
    this.eventData = new FormData();
    // console.log("member id route params: ", this.props.match.params.memberId)
    const eventId = this.props.match.params.eventId;
    this.inState(eventId);
  }

  validation = () => {
    if (this.state.heading.length < 5 || this.state.heading.length > 150) {
      this.setState({ error: "Event heading is either too short or too long. Please try again." })
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

  submitInput = event => {
    event.preventDefault();
    if (this.validation()) {
      const eventId = this.state.id;
      const token = isLoggedin().token;

      this.eventUpdate(eventId, token, this.eventData)
        .then(data => {
          if (data.error) this.setState({ error: data.error })
          else {
            this.setState({ heading: '', body: '', gotToHome: true })
          }
        });
    }
  }

  editEventForm = (heading, body) => (
    <form>
      <div >
        <label >Heading</label>
        <input onChange={this.changeInput("heading")} type="text" value={heading} />
      </div>
      <br/>
      <div >
        <label >Body</label>
        <textarea onChange={this.changeInput("body")} type="text" className="comment" value={body}/>
      </div>
      <button onClick={this.submitInput} className="button"> Update Event </button>
    </form>
  )

  render() {
    const { heading } = this.state
    if (this.state.gotToHome) {
      return <Redirect to={`/event/all`} />;
    }
    return (
      <div className="container">
        <h2 style={{ marginTop: "150px", marginBottom: "100px" }}>{heading}</h2>
        {this.editEventForm(heading, this.state.body)}
        <div style={{ display: this.state.error ? "" : "none" }}>
          {this.state.error}
        </div>
      </div>
    )
  }
}

export default UpdateEvent;