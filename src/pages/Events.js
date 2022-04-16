import React, {Component} from "react";
import "./Events.css";
import Modal from "../components/modal/Modal";
import Backdrop from "../components/backdrop/Backdrop";
import AuthContext from "../context/auth-context";


const getRequestBodyByType = (type, args) => {
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
        events: []
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
        this.fetchEvents();
    }

    startCreateEventHandler = () => {
        this.setState({creating: true});
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
            query: getRequestBodyByType('create', {title, price, date, description})
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
            this.fetchEvents();
        })
        .catch(err => {
            console.log(err)
        })
    }

    modalCancelHandler = () => {
        this.setState({creating: false});
    }

    fetchEvents() {
        let requestBody = {
            query: getRequestBodyByType('getList', {})
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
            this.setState({events: events});
        })
        .catch(err => {
            console.log(err)
        })
    }

    render() {
        const eventList = this.state.events.map(event => {
            return (
                <li key={event._id} className="events_list-item">
                    {event.title}
                </li>
            );
        })
        return (
            <React.Fragment>
                {this.state.creating && <Backdrop/>}
                {this.state.creating && (
                    <Modal title={"Add event"}
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
                {this.context.token && (<div className="events-control">
                    <p>Share events</p>
                    <button className="btn" onClick={this.startCreateEventHandler}>
                        Create Event
                    </button>
                </div>)}
                <ul className="events_list">{eventList}</ul>
            </React.Fragment>
        )
    }
}

export default EventsPage;
