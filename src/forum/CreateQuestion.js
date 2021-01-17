import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { isLoggedin } from '../member/memberAccount';


class CreateQuestion extends Component {

  constructor() {
    super()
    this.state = { heading: '', body: '', error: '', member: {}, goToHome: false }
  }

  // API call to create question
  postQuestion = (memberId, token, question) => {
    return fetch(`${process.env.REACT_APP_API_URL}/question/new/${memberId}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      },
      body: question
    })
      .then(res => {
        return res.json()
      })
      .catch(err => console.log(err))
  };

  componentDidMount() {
    this.questionData = new FormData();
    this.setState({ member: isLoggedin().member })
  }

  validation = () => {
    if (this.state.heading.length < 5 || this.state.heading.length > 150) {
      this.setState({ error: "Your heading is either too short or too long. Please try again." })
      return false
    } else if (this.state.body.length < 15 || this.state.body.length > 1000) {
      this.setState({ error: "Question body is either too short or too long. Please try again." })
      return false
    }
    return true;
  }

  changeInput = name => event => {
    const value = event.target.value;
    this.questionData.set(name, value);
    this.setState({ [name]: value });
  };

  submitQuestion = event => {
    event.preventDefault();
    if (this.validation()) {
      const memberId = isLoggedin().member._id;
      const token = isLoggedin().token;
      this.postQuestion(memberId, token, this.questionData)
        .then(data => {
          if (data.error) this.setState({ error: data.error })
          else {
            console.log("New question: ", data);
            this.setState({ heading: '', body: '', goToHome: true })
          }
        });
    }
  }

  newQuestionForm = (heading, body) => (
    <form>
      <div >
        <label>Heading</label>
        <input onChange={this.changeInput("heading")} type="text" value={heading} />
      </div>
      <br />
      <div >
        <label >Body</label>
        <textarea onChange={this.changeInput("body")} type="text" className="comment" value={body}
        />
      </div>
      <button onClick={this.submitQuestion} className="button"> Post Question </button>
    </form>
  )

  render() {

    if (this.state.goToHome) {
      return <Redirect to={`/question/all`} />;
    }
    return (
      <div className="container">

        <div style={{ textAlign: "left", margintop: "100px", marginBottom: "50px", marginLeft: "105px", marginRight: "105px", backgroundColor: "#e8e8e8", color: "404040", padding: "25px", borderRadius: "15px" }}>
          <h2>Post A Question In The Public Forum</h2><br />
          <div style={{ fontSize: "1.1em" }} >
            <p>  Please be specific and try to include all the information someone would need to answer your question. </p>
            <p> Please note the maximum length of a question is 1000 characters. </p>
          </div>
        </div>
        {this.newQuestionForm(this.state.heading, this.state.body)}
        <div style={{ display: this.state.error ? "" : "none" }}>
          {this.state.error}
        </div>
      </div>
    );
  }
}

export default CreateQuestion;