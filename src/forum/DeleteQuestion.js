import React, { Component } from 'react';
import { isLoggedin } from '../member/memberAccount';
import { Redirect } from 'react-router-dom';


class DeleteQuestion extends Component {

  state = { goToForum: false }


  // API call delete question
  delete = (questionId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/question/${questionId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        return res.json()
      })
      .catch(err => console.log(err))
  };

  delQuestion = () => {
    const questionId = this.props.questionId;
    const token = isLoggedin().token;
    this.delete(questionId, token).then(data => {
      if (data.error) {
        console.log(data.error)
      } else {
        this.setState({ goToForum: true })
      }
    })
  }

  confirmDelete = () => {
    let conf = window.confirm("Please confirm that you would like to remove this question?")
    if (conf) {
      this.delQuestion()
    }
  }

  render() {
    if (this.state.goToForum) {
      return <Redirect to="/question/all" />
    }
    return (
      <button onClick={this.confirmDelete} className="button">
        Delete Question
      </button>
    );
  }
}

export default DeleteQuestion;