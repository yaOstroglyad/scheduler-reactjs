import React, {Component} from "react";
import './App.css';
import {BrowserRouter, Route, Navigate, Routes} from "react-router-dom";
import UsersPage from "./pages/Users";
import BookingsPage from "./pages/Bookings";
import EventsPage from "./pages/Events";
import LoginPage from "./pages/Login";
import NotFoundPage from "./pages/NotFound";
import MainNavigation from "./components/navigation/MainNavigation";
import AuthContext from "./context/auth-context";


class App extends Component {
    state = {
        token: null,
        userId: null
    }

    login = (token, userId, tokenExpiration) => {
        this.setState({token: token, userId: userId})
    };

    logout = () => {
        this.setState({token: null, userId: null})
    };

    render() {
        return (
            <BrowserRouter>
                <React.Fragment>
                    <AuthContext.Provider value={{
                        token: this.state.token,
                        userId: this.state.userId,
                        login: this.login,
                        logout: this.logout
                    }}>
                    <MainNavigation />
                    <main className="main-content">
                        <Routes>
                            {!this.state.token && <Route path="/login" element={<LoginPage/>}/>}
                            {this.state.token && <Route path="/users" element={<UsersPage/>}/>}
                            {this.state.token && <Route path="/bookings" element={<BookingsPage/>}/>}
                            <Route path="/events" element={<EventsPage/>}/>
                            <Route path="/recovery-password" element={null}/>
                            {this.state.token && <Route path="*" element={<Navigate to="/events" exact/>}/>}
                            {!this.state.token && <Route path="*" element={<Navigate to="/login" exact/>}/>}
                            <Route path="*" element={<NotFoundPage/>}/>
                        </Routes>
                    </main>
                    </AuthContext.Provider>
                </React.Fragment>
            </BrowserRouter>
        );
    }
}

export default App;
