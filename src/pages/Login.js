import React, {Component} from "react";
import "./Login.css";
import AuthContext from "../context/auth-context";

const getRequestBodyByType = (type, args) => {
    const payload = {
        login: `query {
                    login(email: "${args.email}", password: "${args.password}") {
                        userId
                        token
                        tokenExpiration
                    }
                }`,
        registration: `mutation {
                    createUser(user: {email: "${args.email}", password: "${args.password}"}) {
                        email
                        password
                        createdAt
                    }
                }`
    }
    return payload[type];
}

class LoginPage extends Component {
    state = {
        isLogin: true
    };

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();

        this.emailEl.current = 'tes1@gmail.com';
        this.passwordEl.current = 'invalidpassword2';
    }

    stateHandler = () => {
        this.setState(prevState => {
            return { isLogin: !prevState.isLogin }
        });
    }


    submitHandler = (event) => {
        event.preventDefault();
        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;

        if (email.trim().length === 0 || password.trim === 0) {
            return;
        }

        let requestBody = {
            query: getRequestBodyByType(this.state.isLogin ? "login" : "registration",  {email, password})
        }

        fetch('http://localhost:3000/graphql', {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => {
            if(res.status !== 200 && res.status !== 201){
                throw new Error("Failed request!")
            } else {
                return res.json();
            }
        })
        .then(result => {
            if (result.data.login.token) {
                this.context.login(
                    result.data.login.token,
                    result.data.login.userId,
                    result.data.login.tokenExpiration
                )
            }
            console.log(result)
        })
        .catch(err => {
            console.log(err)
        });
    }


    render() {
        return <React.Fragment>
            <h1 className="page-title">{this.state.isLogin ? "Login" : "Sign up"}</h1>
            <form className="auth-form" onSubmit={this.submitHandler}>
                <div className="form-control">
                    <label htmlFor="email">E-mail</label>
                    <input type="email"
                           id="email"
                           ref={this.emailEl}
                           defaultValue={this.emailEl.current}/>
                </div>
                <div className="form-control">
                    <label htmlFor="password">Password</label>
                    <input type="password"
                           id="password"
                           ref={this.passwordEl}
                           defaultValue={this.passwordEl.current}/>
                </div>
                <div className="form-actions">
                    <button type="button" onClick={this.stateHandler}>Switch to {this.state.isLogin ? "Sign up" : "Login"}</button>
                    {/*<button type="button" onClick={e => this.stateHandler(e, "resetPassword")}>Forgot password</button>*/}
                    <button type="submit">Submit</button>
                </div>
            </form>
        </React.Fragment>
    }
}

export default LoginPage;
