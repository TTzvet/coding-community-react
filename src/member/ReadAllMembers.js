import React, { Component } from 'react';
import AccountImage from '../images/account.png';
import { Link } from 'react-router-dom';
const NoShadow = { boxShadow: 'none' };

export class ReadAllMembers extends Component {
  constructor() {
    super()
    this.state = { members: [] }
  }

  // API call get all members
  getAllMembers = () => {
    return fetch(`${process.env.REACT_APP_API_URL}/members`, {
      method: "GET",
    })
      .then(res => {
        return res.json()
      })
      .catch(err => console.log(err))
  }

  componentDidMount() {
    this.getAllMembers().then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ members: data })
      }
    });
  }

  renderMembers = (members) => (
    <div className="row">
      {/* {JSON.stringify(members)} */}
      {members.map((member, i) => (
        <div className="card col-md-6" key={i} style={{ backgroundColor: "#f1f1f1" }}>
          <div >
            <div className="row">
              <div className="col-md-6">
                <img style={{ height: "200px", width: "250px", float: "left", marginRight: "10px" }}
                  className="img-thumbnail" src={`${process.env.REACT_APP_API_URL}/member/image/${member._id}`}
                  onError={i => (i.target.src = `${AccountImage}`)}
                  alt={member.name} />
              </div>
              <div className="col-md-6">
                <br />
                <br />
                <h5 >{member.name}</h5>
                <br />
                <div className="row">
                  <div className="col-md-8" style={NoShadow}>
                    <Link to={`/member/${member._id}`} className="button" >View Member</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  render() {
    return (

      <div>
        <div style={{ textAlign: "left", margintop: "100px", marginBottom: "50px", marginLeft: "105px", marginRight: "105px", backgroundColor: "#e8e8e8", color: "404040", padding: "25px", borderRadius: "15px" }}>
          <h2>Women's Coding Community - Members</h2><br />
          <div style={{ fontSize: "1.1em" }}>
            <p>Our community have members with different backgrounds including aspiring coders who are at the beginning of their coding journey as well as professionals with years of experience.</p>
            <p>To find out more about our members click on the <q>View Member</q> button. <strong>Please note only members who are logged in can view other member accounts</strong>.  </p>
          </div>
        </div>
        <div className="container">
          <h2 style={{ marginBottom: "50px", textAlign: "center" }}>Our Members</h2>
          <hr />
          {this.renderMembers(this.state.members)}
        </div>
      </div>
    );
  }
}

export default ReadAllMembers;