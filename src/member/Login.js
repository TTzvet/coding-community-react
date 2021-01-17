import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class Login extends Component {
    constructor() {
        super();
        this.state = {  email: "", password: "", error: "",  goToHome: false };
    }

    // API call login
    login = (member) => {
        return fetch(`${process.env.REACT_APP_API_URL}/login`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-type": "application/json"
            },
            body: JSON.stringify(member)
        })
            .then(response => {
                return response.json()
            })
            .catch(err => console.log(err))
    };

    auth = (jwt, next) => {
        if (typeof window !== "undefined") {
            localStorage.setItem("jwt", JSON.stringify(jwt))
            next()
        }
    }

    addInput = name => e => {
        this.setState({ [name]: e.target.value })
    };

    submitInput = event => {
        event.preventDefault();
        const { email, password } = this.state;
        const member = {  email, password  };
        console.log(member);
        this.login(member).then(data => {
            if (data.error) {
                this.setState({ error: data.error })
            } else {
                this.auth(data, () => {
                    this.setState({ goToHome: true })
                })
            }
        })
    }

    loginForm = (email, password) => (
        <form className="membersForm">
            <div >
                <br />
                <label>Your Email</label>
                <input onChange={this.addInput("email")} type="email" className="loginInput" value={email} />
            </div>
            <div >
                <label >Your Password</label>
                <input onChange={this.addInput("password")} type="password" className="loginInput" value={password} />
            </div>
            <button onClick={this.submitInput} className="formButton">Submit</button>
        </form>
    )

    render() {

        if (this.state.goToHome) {
            return <Redirect to="/" />
        }
        return (
            <div>
                <div className="container">
                <div style={{ textAlign: "left", margintop: "100px", marginBottom: "50px", marginLeft: "105px", marginRight: "105px", backgroundColor: "#e8e8e8", color: "404040", padding: "25px", borderRadius: "15px" }}>
                        <h2>Women's Coding Community - Login Page</h2><br />
                        <div style={{ fontSize: "1.1em" }}>
                            <p> Please log into your account in order to get full access to our community including posting questions, blogs and events.</p>
                        </div>
                    </div>
                    {this.loginForm(this.state.email, this.state.password)}
                    <div style={{ display: this.state.error ? "" : "none" }}>
                        {this.state.error}
                    </div>
                </div>
            </div>
        );
    }

}

export default Login; 