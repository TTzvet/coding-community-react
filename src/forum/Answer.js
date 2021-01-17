import React, { Component } from 'react';
import { isLoggedin } from '../member/memberAccount';
import { Link } from 'react-router-dom';

class Answer extends Component {
  state = { content: "", err: "" }

  // API call answers
  answer = (memberId, token, questionId, answer) => {
    return fetch(`${process.env.REACT_APP_API_URL}/question/answer`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ memberId, questionId, answer })
    })
      .then(res => {
        return res.json()
      })
      .catch(err => console.log(err))
  };

  changeInput = e => {
    this.setState({ content: e.target.value });
  }

  validationAnswer = () => {
    if (this.state.content.length <= 0 || this.state.content.length > 800) {
      this.setState({ err: "Your question is too short or too long. Please try again." })
      return false
    }
    return true
  }

  addAnswer = event => {
    event.preventDefault()
    if (!isLoggedin()) {
      this.setState({ err: "Only members can add an answer. Please log in." })
      return false
    }
    if (this.validationAnswer()) {
      const memberId = isLoggedin().member._id
      const token = isLoggedin().token
      const questionId = this.props.questionId
      this.answer(memberId, token, questionId, { content: this.state.content })
        .then(data => {
          if (data.error) {
            console.log(data.error)
          } else {
            this.setState({ content: '' })
            this.props.updateAnswers(data.answers);
          }
        })
    }
  }

  render() {
    const { answers } = this.props
    return (
      <div>
        <br/>
        <form onSubmit={this.addAnswer}>
          <div className="comment">
            <input type="text"
              onChange={this.changeInput}
              value={this.state.content}
              placeholder="Leave an answer..."
            />
          </div>
        </form>
        <div style={{ display: this.state.err ? "" : "none" }}>
          {this.state.err}         
        </div>
        <br/>
        <div className="col-md-12">
          <h3 style={{color: "#2196F3"}}>Previous answers</h3>
          <hr />
          {answers.map((answer, i) => (
            <div key={i}>
              <div>
                <Link to={`/member/${answer.author._id}`}></Link>
                <div>
                  <p>
                    {answer.content}
                    <p style={{fontStyle: "italic", fontSize: "0.8em"}}>
                      Author <Link
                        to={`/member/${answer.author._id}`} style={{color: "#2196F3"}}>
                        {answer.author.name}
                      </Link>
                      {new Date(answer.created).toDateString()}
                    </p>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default Answer;



