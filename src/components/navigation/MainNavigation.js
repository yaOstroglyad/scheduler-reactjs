import React from "react";
import {NavLink} from "react-router-dom";
import "./MainNavigation.css";
import AuthContext from "../../context/auth-context";

const mainNavigation = props => (
    <AuthContext.Consumer>
        {(context) => {
            return (<header className="main-navigation">
                <div className="main-navigation_logo">
                    <h1>Scheduler</h1>
                </div>
                <nav className="main-navigation_items">
                    <ul className="navigation-button">
                        {context.token && (<React.Fragment>
                            <li><NavLink to="/users"> Users </NavLink></li>
                            <li><NavLink to="/bookings"> Bookings </NavLink></li>
                        </React.Fragment>)}
                        <li><NavLink to="/events"> Events </NavLink></li>
                        {context.token && <li>
                            <button onClick={context.logout}> Logout </button>
                        </li>}
                    </ul>
                </nav>
            </header>)
        }}
    </AuthContext.Consumer>
);

export default mainNavigation;
