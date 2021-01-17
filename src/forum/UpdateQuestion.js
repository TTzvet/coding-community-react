import React, { Component } from 'react';
import { isLoggedin } from '../member/memberAccount';
import { Redirect } from 'react-router-dom';
import { memberQuestion } from './memberQuestion';


class UpdateQuestion extends Component {
  constructor() {
    super()
    this.state = { id: '', heading: '', body: '', gotToHome: false, error: '' }
  }

  // API call update question
  questionUpdate = (questionId, token, question) => {
    console.log(questionId, token, question);
    return fetch(`${process.env.REACT_APP_API_URL}/question/${questionId}`, {
      method: "PUT",
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

  inState = questionId => {
    memberQuestion(questionId).then(data => {
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
    this.questionData = new FormData();
    // console.log("member id route params: ", this.props.match.params.memberId)
    const questionId = this.props.match.params.questionId;
    this.inState(questionId);
  }

  validation = () => {
    if (this.state.heading.length < 5 || this.state.heading.length > 150) {
      this.setState({ error: "Question heading is either too short or too long. Please try again." })
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

  submitInput = event => {
    event.preventDefault();
    if (this.validation()) {
      const questionId = this.state.id;
      const token = isLoggedin().token;
      this.questionUpdate(questionId, token, this.questionData)
        .then(data => {
          if (data.error) this.setState({ error: data.error })
          else {
            this.setState({ heading: '', body: '', gotToHome: true })
          }
        });
    }
  }

  editQuestionForm = (heading, body) => (
    <form>
      <div >
        <label >Heading</label>
        <input onChange={this.changeInput("heading")} type="text" value={heading} />
      </div>
      <br />
      <div >
        <label >Body</label>
        <textarea onChange={this.changeInput("body")} type="text" className="comment" value={body}
        />
      </div>
      <button onClick={this.submitInput} className="button"> Update Question </button>
    </form>
  )

  render() {
    const { heading } = this.state
    if (this.state.gotToHome) {
      return <Redirect to={`/question/all`} />;
    }

    return (
      <div className="container">
        <h2 style={{ marginTop: "150px", marginBottom: "100px" }}>{heading}</h2>
        {this.editQuestionForm(heading, this.state.body)}
        <div style={{ display: this.state.error ? "" : "none" }}>
          {this.state.error}
        </div>
      </div>
    )
  }
}

export default UpdateQuestion;