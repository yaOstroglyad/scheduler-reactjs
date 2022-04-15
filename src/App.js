import React, {Component} from "react";
import './App.css';
import {BrowserRouter, Route, Navigate, Routes} from "react-router-dom";
import UsersPage from "./pages/Users";
import BookingsPage from "./pages/Bookings";
import EventsPage from "./pages/Events";
import LoginPage from "./pages/Login";
import NotFoundPage from "./pages/NotFound";


class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate from="/" to="login" replace/>}/>
                    <Route exact path="/login" element={<LoginPage/>}/>
                    <Route path="/users" element={<UsersPage/>}/>
                    <Route path="/events" element={<EventsPage/>}/>
                    <Route path="/bookings" element={<BookingsPage/>}/>
                    <Route path="/recovery-password" element={null}/>
                    <Route path="*" element={<NotFoundPage/>}/>
                </Routes>
            </BrowserRouter>
        );
    }
}

export default App;
