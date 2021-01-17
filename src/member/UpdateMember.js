import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { isLoggedin } from '../member/memberAccount';
import { getMember } from './memberAccount';
import AccountImage from '../images/account.png';


class UpdateMember extends Component {

  constructor() {
    super()
    this.state = { id: "", name: "", email: "", password: "", goToAccount: false, error: "", sizeImage: 0, about: "", linkedin: "", interest: "", contribution: "" }
  }

  // API call update member
  updateMember = (memberId, token, member) => {
    console.log("MEMBER DATA UPDATE: ", member);
    return fetch(`${process.env.REACT_APP_API_URL}/member/${memberId}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      },
      body: member
    })
      .then(res => {
        return res.json()
      })
      .catch(err => console.log(err))
  };

  inState = (memberId) => {
    const token = isLoggedin().token;
    getMember(memberId, token).then(data => {
      if (data.error) {
        //console.log("error message");
        this.setState({ goToAccount: true });
      } else {
        //console.log(data);
        this.setState({ id: data._id, name: data.name, email: data.email, error: "", about: data.about, linkedin: data.linkedin, interest: data.interest, contribution: data.contribution });
      }
    })
  }

  componentDidMount() {
    this.memberData = new FormData();
    // console.log("check member id route par: ", this.props.match.params.memberId)
    const memberId = this.props.match.params.memberId;
    this.inState(memberId);
  }

  validation = () => {
    if (this.state.sizeImage > 500000) {
      this.setState({
        error: "Please add an image which is at least 500kb",
      });
      return false;
    }
    if (this.state.name.length === 0) {
      this.setState({ error: "Please make sure you have added your name" })
      return false
    }
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(this.state.email)) {
      this.setState({ error: "Please make sure you have entered correct email address" })
      return false
    }
    if (this.state.password.length >= 1 && this.state.password.length <= 4) {
      this.setState({
        error: "Please provide a password which is at least 5 characters long",
      })
      return false
    }
    return true;
  }

  addInput = name => e => {
    const value = name === "photo" ? e.target.files[0] : e.target.value;
    const sizeImage = name === "photo" ? e.target.files[0].size : 0;
    this.memberData.set(name, value);
    this.setState({ [name]: value, sizeImage: sizeImage });
  };
  submitInput = event => {
    event.preventDefault();
    if (this.validation()) {
      // console.log(member);
      const memberId = this.props.match.params.memberId;
      const token = isLoggedin().token;
      this.updateMember(memberId, token, this.memberData)
        .then(data => {
          if (data.error) this.setState({ error: data.error })
          else
            this.setState({
              goToAccount: true
            });
        })
    }
  }

  register = (name, email, password, about, linkedin, interest, contribution) => (
    <form>
      <div >
        <br/>
        <label>Account Photo</label>
        <br/>
        <input onChange={this.addInput("photo")} type="file" accept="image/*" />
      </div>
      <br/>
      <div>
        <label>Name</label>
        <input onChange={this.addInput("name")} type="text" value={name} />
      </div>
      <br/>
      <div >
        <label>Email</label>
        <input onChange={this.addInput("email")} type="email"  value={email} />
      </div>
      <br/>
      <div >
        <label>About</label>
        <textarea onChange={this.addInput("about")} type="text" className="comment" value={about} />
      </div>
      <br/>
      <div >
        <label>LinkedIn Profile</label>
        <textarea onChange={this.addInput("linkedin")} type="text" className="comment" value={linkedin} />
      </div>
      <br/>
      <div>
        <label>Skills and Interests</label>
        <textarea onChange={this.addInput("interest")} type="text" className="comment" value={interest} />
      </div>
      <br/>
      <div >
        <label>My Contribution To The Community</label>
        <textarea onChange={this.addInput("contribution")} type="text" className="comment" value={contribution} />
      </div>
      <br/>
      <div >
        <label>Password</label>
        <input onChange={this.addInput("password")} type="password" className="comment" value={password} />
      </div>
      <button onClick={this.submitInput} className="button">Update</button>
    </form>
  )

  render() {
    const { id, name } = this.state;
    if (this.state.goToAccount) {
      return <Redirect to={`/member/${id}`} />;
    }
    const imageLink = id ? `${process.env.REACT_APP_API_URL}/member/image/${id}?${new Date().getTime()}` : AccountImage;
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Edit Account</h2>
        <div style={{ display: this.state.error ? "" : "none" }}>
          {this.state.error}
        </div>
        <img style={{ height: "150px", width: "150" }} src={imageLink} onError={i => (i.target.src = `${AccountImage}`)} alt={name} />
        {this.register(name, this.state.email, this.state.password, this.state.about, this.state.linkedin, this.state.interest, this.state.contribution)}
      </div>
    );
  }
}

export default UpdateMember;