import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import { isLoggedin } from '../member/memberAccount';
import SearchQuestion from './SearchQuestion';
const NoShadow = { boxShadow: 'none' };

export class ReadAllQuestions extends Component {
  constructor() {
    super()
    this.state = { questions: [] }
  }

  // API call get all questions
  getAll = () => {
    return fetch(`${process.env.REACT_APP_API_URL}/question/all`, {
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
        this.setState({ questions: data })
      }
    });
  }

  renderQuestions = questions => {
    return (
      <div className="row">

        {questions.map((question, i) => {
          const authorId = question.author ? `/member/${question.author._id}` : "";
          const authorName = question.author ? question.author.name : " Unknown";

          return (
            <div className="col-md-12" key={i} >

              <div >
                <div className="row" >
                  <div className="col-md-12" style={{backgroundColor: "#e8e8e8", margin: "10px", borderRadius: "15px"}}>
                    <h4 style={{ marginTop: "10px" }}>{question.heading}</h4>
                    <hr />
                    <p style={{ fontSize: "1.2em" }}>{question.body.substring(0, 300)}</p>
                    <p style={{ fontStyle: "italic" }}>
                      Author <Link
                        to={`${authorId}`} style={{ color: "#2196F3" }}>
                        {authorName}
                        {" "}
                      </Link> on {new Date(question.created).toDateString()}
                    </p>
                    <div className="row">
                      <div className="col-md-8" style={NoShadow}></div>
                      <div className="col-md-4" style={{ textAlign: "right" }}>
                        <Link to={`/question/${question._id}`} className="button" style={{marginBottom: "10px"}}>LEAVE AN ANSWER</Link>
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
          <h2>Women&apos;s Coding Community - Forum</h2><br />
          <div style={{ fontSize: "1.1em" }}>
            <p>Welcome to our community forum! Whether you have some specific coding questions, or you would like to ask for a more general advice like where are the best places for coding internships. This is the place to talk about any topics related to career in coding.</p>
            <p>You don&apos;t need to be logged in to browse or read in our community forum. <strong>Please note that only members can ask or answer questions</strong>. </p>
          </div>
          <div>

            {isLoggedin() && (
              <button>
                <Link
                  to={`/question/new`}
                  className="button"
                >
                  NEW QUESTION
                        </Link>
              </button>
            )}
          </div>

        </div>
        <div className="container">
          <div> <SearchQuestion /> </div>
          <h2 style={{ marginTop: "50px", marginBottom: "50px", textAlign: "center" }}>All Forum Questions</h2>
          <hr/>
          {this.renderQuestions(this.state.questions)}

        </div>
      </div>
    );
  }
}

export default ReadAllQuestions;