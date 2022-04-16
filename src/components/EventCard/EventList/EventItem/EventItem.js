import React from 'react';
import "./EventItem.css"


const EventItem = props => {
    return (
    <li key={props.eventId} className="events_list-item">
        <div>
            <h1>{props.title}</h1>
            <h2>$ {props.price} - {props.date}</h2>
        </div>
        <div>
            {props.userId !== props.ownerId && <button className="btn" onClick={props.onDetail.bind(this, props.eventId)}>
                View Details
            </button>}
            {props.userId === props.ownerId && <p>You are the owner of this event.</p>}
        </div>
    </li>
)}

export default EventItem;
