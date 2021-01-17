import React, { Component } from 'react';

class Register extends Component {
    constructor() {
        super();
        this.state = { name: "", email: "", password: "", error: "", success: false }
    }

    // API call create new member
    register = (member) => {
        return fetch(`${process.env.REACT_APP_API_URL}/register`, {
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

    addInput = name => event => {
        this.setState({ [name]: event.target.value })
    };

    submitInput = e => {
        e.preventDefault();
        const { name, email, password } = this.state;
        const member = { name, email, password };
        this.register(member)
            .then(data => {
                if (data.error) this.setState({ error: data.error })
                else this.setState({ error: "", name: "", email: "", password: "", success: true })
            })
    }

    registration = (name, email, password) => (
        <form className="membersForm">
            <div>
                <label>Your Name</label>
                <input onChange={this.addInput("name")} type="text" className="regInput" value={name} />
            </div>
            <div>
                <label>Your Email Address</label>
                <input onChange={this.addInput("email")} type="email" className="regInput" value={email} />
            </div>
            <div >
                <label >Your Password (min 5 characters)</label>
                <input onChange={this.addInput("password")} type="password" className="regInput" value={password} />
            </div>
            <button onClick={this.submitInput} className="formButton">Register</button>
        </form>
    )

    render() {

        return (
            <div>
                <div className="container">
                    <div style={{ textAlign: "left", margintop: "100px", marginBottom: "50px", marginLeft: "105px", marginRight: "105px", backgroundColor: "#e8e8e8", color: "404040", padding: "25px", borderRadius: "15px" }}>
                        <h2>Women's Coding Community - Join Our Community</h2><br />
                        <div style={{ fontSize: "1.1em" }}>
                            <p> Become a member today so you can get full access to our community pages including posting questions, blogs and events. </p>
                        </div>
                    </div>
                    <div>
                        {this.registration(this.state.name, this.state.email, this.state.password)}
                    </div>
                    <div style={{ display: this.state.success ? "" : "none" }}>
                        You have successfully created your account. Please log in.
                </div>
                    <div style={{ display: this.state.error ? "" : "none" }}>
                        {this.state.error}
                    </div>
                </div>
            </div>
        );
    }

}

export default Register; 