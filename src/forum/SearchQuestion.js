import React, { Component } from 'react';

import { Link } from 'react-router-dom';
const NoShadow = { boxShadow: 'none' };

class SearchQuestion extends Component {
  constructor() {
    super()
    this.state = {
      searchTerm: "",
      questions: []
    }
  }

  addInput = (searchTerm) => (event) => {
    this.setState({ [searchTerm]: event.target.value });
  }

  // API call to post search term and get results
  submitInput = event => {
    event.preventDefault()
    const { searchTerm } = this.state
    const search = { searchTerm }
    //console.log(search);
    fetch(`${process.env.REACT_APP_API_URL}/question/search`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(search)
    })
      .then(res => {
        return res.json()
      })
      .then(data => {
        this.setState({ questions: data })
      })
      .catch(err => console.log(err))
  }

  renderQuestions = questions => {
    return (
      <div className="row">
        {questions.map((question, i) => {
          const authorId = question.author ? `/member/${question.author._id}` : "";
          const authorName = question.author ? question.author.name : " Unknown";
          return (
            <div className="col-md-12" key={i}>
              <div >
                <div className="row">
                  <div className="col-md-12" style={{ backgroundColor: "#e8e8e8", margin: "10px", borderRadius: "15px" }}>
                    <h4 style={{ marginTop: "10px" }}>{question.heading}</h4>
                    <hr />
                    <p style={{ fontSize: "1.2em" }}>{question.body.substring(0, 300)}</p>
                    <p style={{ fontStyle: "italic" }}>
                      Author <Link to={`${authorId}`} style={{ color: "#2196F3" }}> {authorName} {" "} </Link>
                      on {new Date(question.created).toDateString()}
                    </p>
                    <div className="row">
                      <div className="col-md-8" style={NoShadow}></div>
                      <div className="col-md-4" style={{ textAlign: "right" }}>
                        <Link to={`/question/${question._id}`}
                          className="button">LEAVE AN ANSWER</Link>
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
    const { questions } = this.state
    return (
      <div className="container">
        <div >
          <form className="searchForm">
            <input onChange={this.addInput("searchTerm")} type="text" placeholder="Search questions..." value={this.state.searchTerm} />
            <button type="submit" onClick={this.submitInput}><i className="fa fa-search"></i></button>
          </form>
        </div>
        {this.renderQuestions(questions)}
      </div>
    )
  }
}

export default SearchQuestion;