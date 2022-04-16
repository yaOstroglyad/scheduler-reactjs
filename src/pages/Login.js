import React, { Component } from "react";
import "./Login.css";

class LoginPage extends Component {
    render() {
        return <form className="auth-form">
            <div className="form-control">
                <label htmlFor="email">E-mail</label>
                <input type="email" id="email"/>
            </div>
            <div className="form-control">
                <label htmlFor="password">Password</label>
                <input type="password" id="password"/>
            </div>
            <div className="form-actions">
                <button type="button">Switch to Signup</button>
                <button type="button">Forgot password</button>
                <button type="submit">Submit</button>
            </div>
        </form>
    }
}

export default LoginPage;
