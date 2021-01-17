import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { isLoggedin } from '../member/memberAccount';
const NoShadow = { boxShadow: 'none' };

export class ReadAllEvents extends Component {
  constructor() {
    super()
    this.state = { events: [] }
  }

  // API call to get all events
  getAll = () => {
    return fetch(`${process.env.REACT_APP_API_URL}/event/all`, {
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
        this.setState({ events: data })
      }
    });
  }

  renderEvents = events => {
    return (
      <div className="row">
        {events.map((event, i) => {
          const authorId = event.author ? `/member/${event.author._id}` : "";
          const authorName = event.author ? event.author.name : " Unknown";
          return (
            <div className="col-md-12" key={i}>

              <div >
                <div className="row" >

                  <div className="col-md-12" style={{ backgroundColor: "#e8e8e8", margin: "10px", borderRadius: "15px" }}>
                    <h4 style={{ marginTop: "20px" }}>{event.heading}</h4>
                    <hr />
                    <p style={{ fontStyle: "italic" }}>
                      Author <Link to={`${authorId}`} style={{ color: "#2196F3" }}> {authorName} {" "} </Link>
                      on {new Date(event.created).toDateString()}
                    </p>
                    <div className="row">
                      <div className="col-md-8" style={NoShadow}></div>
                      <div className="col-md-4" style={NoShadow}>
                        <Link to={`/event/${event._id}`}
                          className="button" style={{ marginBottom: "10px" }}>TELL US IF YOU ARE INTERESTED</Link>
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
          <h2>Women&apos;s Coding Community - Events</h2><br />
          <div style={{ fontSize: "1.1em" }} >
            <p> Are you looking to meet other members or get advice from professionals on how to get to the next level in your coding career. We host regular video online calls and ad hoc webinars, workshops and networking events.  </p>
            <p> If you are interested in any of those events please tells us by clicking on the <q>Interested</q> button on the event page. We look forward to meeting you!</p>
          </div>
          <div>
            {isLoggedin() && (
              <button>
                <Link to={`/event/new`} className="button">NEW EVENT</Link>
              </button>
            )}
          </div>
        </div>
        <div className="container">
          <h2 style={{ marginTop: "50px", marginBottom: "50px", textAlign: "center" }}>Community&apos;s Events</h2>
          <hr />
          {this.renderEvents(this.state.events)}
        </div>
      </div>
    );
  }
}

export default ReadAllEvents;