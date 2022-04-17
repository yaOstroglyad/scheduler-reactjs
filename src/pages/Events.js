import React, {Component} from "react";
import "./Events.css";
import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import AuthContext from "../context/auth-context";
import EventList from "../components/EventCard/EventList/EventList";
import Spinner from "../components/Spinner/Spinner";


const bookingSchema = (type, args) => {
    const payload = {
        booking: `mutation {
	        bookEvent(eventId: "${args.eventId}", userId: "${args.userId}") {
                _id
                createdAt
                updatedAt
                user {
                    _id
                    email
                }
            }
        }`
    }
    return payload[type];
}


const eventsSchema = (type, args) => {
    const payload = {
        create: `mutation {
            createEvent(event: {
                title: "${args.title}",
                description: "${args.description}",
                price: ${args.price},
                date: "${args.date}"
            }) {
                _id
                title
                price
                description
                date
                owner {
                    _id
                    email
                }
            }
        }`,
        update: `mutation {
            updateEvent(event: {
                title: "${args.title}",
                description: "${args.description}",
                price: ${args.price},
                date: "${args.date}"
            }) {
                _id
                title
                price
                description
                date
                owner {
                    _id
                    email
                }
            }
        }`,
        getList: `query {
            events {
                _id
                title
                price
                description
                date
                owner {
                    _id
                    email
                }
            }
        }`
    }
    return payload[type];
}

class EventsPage extends Component {
    state = {
        creating: false,
        events: [],
        isLoading: false,
        selectedEvent: null,
        isActive: true
    }

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.titleEl = React.createRef();
        this.priceEl = React.createRef();
        this.dateEl = React.createRef();
        this.descriptionEl = React.createRef();
    }

    componentDidMount() {
        this.setState({isActive: true})
        this.fetchEvents();
    }

    startCreateEventHandler = () => {
        this.setState({creating: true});
    }

    bookEventHandler = () => {
        this.setState({isLoading: true});

        if (!this.context.token) {
            this.setState({selectedEvent: null, isLoading: false});
            return;
        }

        const eventId = this.state.selectedEvent._id;
        const token = this.context.token;
        const userId = this.context.userId;

        // TODO implement object with variables for request
        //         let requestBody = {
        //             query: bookingSchema('booking', {eventId, userId}),
        //             variables: {
        //                  eventId: eventId
        //                  userId: userId
        //             }
        //         }
        let requestBody = {
            query: bookingSchema('booking', {eventId, userId})
        }

        fetch('http://localhost:3000/graphql', {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
                "Authorization": 'Bearer ' + token,
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
        .then(event => {
            console.log('event', event)
        })
        .catch(err => {
            console.log(err)
        })
        this.setState({isLoading: false});
        this.setState({selectedEvent: null})
    }

    modalConfirmHandler = () => {
        this.setState({creating: false});
        const title = this.titleEl.current.value;
        const price = +this.priceEl.current.value;
        const date = this.dateEl.current.value;
        const description = this.descriptionEl.current.value;

        if (title.trim().length === 0 ||
            price <= 0 ||
            date.trim().length === 0 ||
            description.trim().length === 0) {
            return;
        }

        let requestBody = {
            query: eventsSchema('create', {title, price, date, description})
        }

        const token = this.context.token;

        fetch('http://localhost:3000/graphql', {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
                "Authorization": 'Bearer ' + token,
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
        .then(event => {
            this.setState(prevState => {
                const updatedEvents = [...prevState.events];
                updatedEvents.push({
                    ...event.data.createEvent
                });
                return { events: updatedEvents };
            })
        })
        .catch(err => {
            console.log(err)
        })
    }

    modalCancelHandler = () => {
        this.setState({creating: false, selectedEvent: null});
    }

    showDetailHandler = eventId => {
        this.setState(prevState => {
            const selectedEvent = prevState.events.find(e => e._id === eventId);
            return {selectedEvent: selectedEvent}
        })
    };

    fetchEvents() {
        this.setState({isLoading: true});

        let requestBody = {
            query: eventsSchema('getList', {})
        }

        fetch('http://localhost:3000/graphql', {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
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
            const events = resultDate.data.events;
            console.log('this.state.isActive', this.state.isActive)
            if (this.state.isActive) {
                this.setState({events: events, isLoading: false});
            }
        })
        .catch(err => {
            console.log(err)
            if (this.state.isActive) {
                this.setState({isLoading: false});
            }
        })
    }

    componentWillUnmount() {
        this.setState({isActive: false})
    }

    render() {
        return (
            <React.Fragment>
                {(this.state.creating || this.state.selectedEvent) && <Backdrop/>}
                {this.state.creating && (
                    <Modal title={"Add event"}
                           confirmText={"Confirm"}
                           canCancel
                           canConfirm
                           onCancel={this.modalCancelHandler}
                           onConfirm={this.modalConfirmHandler}>
                        <form action="">
                            <div className="form-control">
                                <label htmlFor="title">Title</label>
                                <input type="text" id="title" ref={this.titleEl}/>
                            </div>
                            <div className="form-control">
                                <label htmlFor="price">Price</label>
                                <input type="text" id="price" ref={this.priceEl}/>
                            </div>
                            <div className="form-control">
                                <label htmlFor="date">Date</label>
                                <input type="datetime-local" id="date" ref={this.dateEl}/>
                            </div>
                            <div className="form-control">
                                <label htmlFor="description">Description</label>
                                <textarea id="description" ref={this.descriptionEl}/>
                            </div>
                        </form>
                    </Modal>)}
                {this.state.selectedEvent && (
                    <Modal title={"Event details: " + this.state.selectedEvent.title}
                           confirmText={this.context.token ? "Book" : "Confirm"}
                           canCancel
                           canConfirm
                           onCancel={this.modalCancelHandler}
                           onConfirm={this.bookEventHandler}>
                        <h1>{this.state.selectedEvent.title}</h1>
                        <h2>{this.state.selectedEvent.price} - {new Date(this.state.selectedEvent.date).toLocaleDateString()}</h2>
                        <p>{this.state.selectedEvent.description}</p>
                    </Modal>)}
                {this.context.token && (<div className="events-control">
                    <p>Share events</p>
                    <button className="btn" onClick={this.startCreateEventHandler}>
                        Create Event
                    </button>
                </div>)}
                {this.state.isLoading ?
                    (<Spinner/>) :
                    (<EventList events={this.state.events}
                                authUserId={this.context.userId}
                                onViewDetail={this.showDetailHandler}/>)}

            </React.Fragment>
        )
    }
}

export default EventsPage;
