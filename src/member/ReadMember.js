import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { isLoggedin } from '../member/memberAccount';
import { getMember } from './memberAccount';
import AccountImage from '../images/account.png';
import DeleteMember from './DeleteMember';

class ReadMember extends Component {
    constructor() {
        super()
        this.state = { member: "", goToLogin: false, error: "", questions: [], blogs: [], events: [] }
    }

    // API call get all questions by member
    listQuestionsByMember = (memberId, token) => {
        return fetch(`${process.env.REACT_APP_API_URL}/question/by/${memberId}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                return res.json()
            })
            .catch(err => console.log(err))
    }

    // API call get all blogs by member
    listBlogsByMember = (memberId, token) => {
        return fetch(`${process.env.REACT_APP_API_URL}/blog/by/${memberId}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                return res.json()
            })
            .catch(err => console.log(err))
    }

    // API call get all events by member
    listEventsByMember = (memberId, token) => {
        return fetch(`${process.env.REACT_APP_API_URL}/event/by/${memberId}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                return res.json()
            })
            .catch(err => console.log(err))
    }

    inState = (memberId) => {
        const token = isLoggedin().token
        getMember(memberId, token).then(data => {
            if (data.error) {
                console.log("error message");
                this.setState({ goToLogin: true });
            } else {
                //console.log(data);
                this.setState({ member: data });
                this.readQuestions(data._id)
                this.readBlogs(data._id)
                this.readEvents(data._id)

            }
        })
    }

    readQuestions = memberId => {
        const token = isLoggedin().token;
        this.listQuestionsByMember(memberId, token).then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                this.setState({ questions: data })
            }
        })

    }

    readBlogs = memberId => {
        const token = isLoggedin().token;
        this.listBlogsByMember(memberId, token).then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                this.setState({ blogs: data })
            }
        })

    }

    readEvents = memberId => {
        const token = isLoggedin().token;
        this.listEventsByMember(memberId, token).then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                this.setState({ events: data })
            }
        })
    }

    componentDidMount() {
        // console.log("member id route params: ", this.props.match.params.memberId)
        const memberId = this.props.match.params.memberId
        this.inState(memberId);
    }

    UNSAFE_componentWillReceiveProps(props) {
        const memberId = props.match.params.memberId
        this.inState(memberId);
    }

    render() {
        const { member, questions, blogs, events } = this.state;
        if (this.state.goToLogin) return <Redirect to="/login" />

        const imageLink = member._id
            ? `${process.env.REACT_APP_API_URL
            }/member/image/${member._id}?${new Date().getTime()}`
            : AccountImage;

        return (
            <div className="row">
                <div className="card col-md-12">
                    <h2 style={{ textAlign: "center", marginTop: "35px", marginBottom: "15px" }}>Member Account</h2>
                    <div style={{ marginLeft: "20px" }}>
                        <div className="row">
                            <div className="col-md-2">
                                <img style={{ height: "200px", width: "150px" }} src={imageLink} className="img-thumbnail" onError={i => (i.target.src = `${AccountImage}`)} alt={member.name} />
                                <p style={{ fontSize: "1.5em", marginTop: "35px" }}>{member.name}</p>
                                <p style={{ fontSize: "1.5em", marginTop: "35px", marginBottom: "35px" }}>{`Member since ${new Date(member.created)
                                    .toDateString()}`}</p>
                            </div>
                            <div className="col-md-10">
                                <h4>A Short Introduction</h4>
                                <p className="lead">{member.about}</p>
                                <hr />
                                <h4>LinkedIn Profile</h4>
                                <p className="lead">{member.linkedin}</p>
                                <hr />
                                <h4>Skills and Interests</h4>
                                <p className="lead">{member.interest}</p>
                                <hr />
                                <h4>Contribution To The Community</h4>
                                <p className="lead">{member.contribution}</p>
                                <hr />
                                <p>
                                    {isLoggedin().member &&
                                        isLoggedin().member._id === member._id && (
                                            <div>
                                                <Link className="button" to={`/question/new`}> New Question </Link>
                                                <Link className="button" to={`/blog/new`} > New Blog Post </Link>
                                                <Link className="button" to={`/member/update/${member._id}`}> Edit  Acccount </Link>
                                                <DeleteMember memberId={member._id} />
                                            </div>
                                        )
                                    }
                                </p>
                                <hr />
                                <h4>Forum Questions:</h4>
                                {questions.map((question, i) => (
                                    <div key={i}>
                                        <div>
                                            <Link to={`/question/${question._id}`}>
                                                <div>
                                                    <p className="lead">{question.heading}</p>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                                <hr />
                                <h4>Blog Posts:</h4>

                                {blogs.map((blog, i) => (
                                    <div key={i}>
                                        <div>
                                            <Link to={`/blog/${blog._id}`}>
                                                <div>
                                                    <p className="lead">{blog.heading}</p>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                                <hr />
                                <h4>Events:</h4>
                                {events.map((event, i) => (
                                    <div key={i}>
                                        <div>
                                            <Link to={`/event/${event._id}`}>
                                                <div>
                                                    <p className="lead">{event.heading}</p>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ReadMember;