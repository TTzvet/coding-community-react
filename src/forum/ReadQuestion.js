import React, { Component } from 'react';

import { Link, Redirect } from 'react-router-dom';
import { memberQuestion } from './memberQuestion';
import { isLoggedin } from '../member/memberAccount';
import Answer from './Answer';
import DeleteQuestion from './DeleteQuestion'

class ReadQuestion extends Component {
  state = { question: "", goToForum: false, goToLogin: false, interest: false, interests: 0, answers: [] }

  // API calls interest/ no interest
  interest = (memberId, token, questionId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/question/interest`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ memberId, questionId })

    })
      .then(res => {
        return res.json()
      })
      .catch(err => console.log(err))
  };

  nointerest = (memberId, token, questionId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/question/nointerest`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ memberId, questionId })

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

  updateAnswers = answers => {
    this.setState({ answers: answers })
  }

  componentDidMount = () => {
    const questionId = this.props.match.params.questionId;
    memberQuestion(questionId).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          question: data,
          interests: data.interests.length,
          interest: this.matchInterest(data.interests),
          answers: data.answers
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
    const questionId = this.state.question._id;
    const token = isLoggedin().token;
    apiReq(memberId, token, questionId).then(data => {
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

  renderQuestion = question => {
    const authorId = question.author ? `/member/${question.author._id}` : "";
    const authorName = question.author ? question.author.name : " Unknown";

    const { interest } = this.state
    return (

      <div >
        
        <p >{question.body}</p>
        <br />
        <div style={{ textAlign: "right" }}>
          {interest ? (
            <h3 onClick={this.interestTab} style={{ color: "#2196F3", cursor: "pointer" }} >{this.state.interests} Like </h3>
          ) : (
              <h3 onClick={this.interestTab} style={{ color: "#2196F3", cursor: "pointer" }}>{this.state.interests} Like </h3>
            )}
        
        </div>
        <hr />
        <p style={{ fontStyle: "italic", textAlign: "right" }}> Author
          <Link to={`${authorId}`} style={{ color: "#2196F3" }}> {authorName} {" "} </Link>
            on {new Date(question.created).toDateString()}
        </p>
        <div style={{ textAlign: "right" }}>
          <Link to={`/question/all`} className="button"> Back to questions</Link>

          {isLoggedin().member &&
            isLoggedin().member._id === question.author._id &&
            <>
              <Link to={`/question/update/${question._id}`} className="button" > Edit Question</Link>
              <DeleteQuestion questionId={question._id} />
            </>
          }
        </div>
      </div>
    );
  }

  render() {
    const { question } = this.state
    if (this.state.goToForum) {
      return <Redirect to={`/question/all`} />;
    } else if (this.state.goToLogin) {
      return <Redirect to={`/login`} />;
    }
    return (
      <div className="container">
        <h2 style={{ marginTop: "120px", marginBottom: "50px", fontSize: "2.4em", textAlign: "center" }}>{question.heading}</h2>
        <hr />
        {!question ? (
          <div>
            <h2 style={{ marginTop: "120px", marginBottom: "50px", fontSize: "2.4em", textAlign: "center" }}>Please wait while the page loads.</h2>
          </div>
        ) : (
            this.renderQuestion(question)
          )}
        <Answer
          questionId={question._id}
          answers={this.state.answers}
          updateAnswers={this.updateAnswers} />
      </div>
    )
  }
}

export default ReadQuestion;