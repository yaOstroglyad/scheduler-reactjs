import React, { Component } from "react";
import AuthContext from "../context/auth-context";
import Spinner from "../components/Spinner/Spinner";

const bookingSchema = (type, args) => {
    const payload = {
        getList: `query {
            bookings {
                _id
                createdAt
                updatedAt
                event {
                    _id
                    title
                }
                user {
                    _id
                    email
                }
            }
        }`
    }
    return payload[type];
}

class BookingsPage extends Component {
    state = {
        isLoading: false,
        bookings: []
    }

    static contextType = AuthContext;

    componentDidMount() {
        this.fetchBookings();
    }

    fetchBookings = () => {
        this.setState({isLoading: true});

        let requestBody = {
            query: bookingSchema('getList', {})
        }

        fetch('http://localhost:3000/graphql', {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
                "Authorization": "Bearer" + this.context.token,
                "Content-Type": "application/json"
            }
        })
        .then(res => {
            if(res.status !== 200 && res.status !== 201) {
                throw new Error("Failed request!")
            } else {
                return res.json();
            }
        })
        .then(resultDate => {
            const bookings = resultDate.data.bookings;
            this.setState({bookings: bookings, isLoading: false});
        })
        .catch(err => {
            console.log(err)
            this.setState({isLoading: false});
        })
    };

    render() {
        return (
            <React.Fragment>
                {this.state.isLoading ? <Spinner/> : (
                    <ul>{this.state.bookings.map(booking => (
                            <li key={booking._id}>
                                {booking.event.title} - {" "}
                                {new Date(booking.createdAt).toLocaleDateString()}
                            </li>
                        ))}
                    </ul>
                )}
            </React.Fragment>
        )
    }
}

export default BookingsPage;
