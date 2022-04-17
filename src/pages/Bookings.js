import React, { Component } from "react";
import AuthContext from "../context/auth-context";
import Spinner from "../components/Spinner/Spinner";
import BookingList from "../components/Bookings/BookingList/BookingList";

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
        }`,
        cancelBooking: `mutation {
            cancelBooking(bookingId: "${args.bookingId}") {
                _id
                title
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
                "Authorization": 'Bearer ' + this.context.token,
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

    deleteBookingHandler = bookingId => {
        this.setState({isLoading: true});

        let requestBody = {
            query: bookingSchema('cancelBooking', {bookingId})
        }

        fetch('http://localhost:3000/graphql', {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
                "Authorization": 'Bearer ' + this.context.token,
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
            this.setState(prevState => {
                const updatedBookings = prevState.bookings.filter(booking => booking._id !== bookingId)

                return {bookings: updatedBookings, isLoading: false};
            });
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
                    <BookingList bookings={this.state.bookings} onDelete={this.deleteBookingHandler}></BookingList>
                )}
            </React.Fragment>
        )
    }
}

export default BookingsPage;
