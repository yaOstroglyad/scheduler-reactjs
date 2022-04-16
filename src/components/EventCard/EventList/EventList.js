import React from 'react';
import "./EventList.css"
import EventItem from "./EventItem/EventItem";


const EventList = props => {
    const events = props.events.map(event => {
        return (
            <EventItem key={event._id}
                       userId={props.authUserId}
                       ownerId={event.owner._id}
                       eventId={event._id}
                       date={new Date(event.date).toLocaleDateString()}
                       title={event.title}
                       price={event.price}
                       onDetail={props.onViewDetail}
            ></EventItem>
        );
    })
    return (<ul className="event_list">{events}</ul>)
}

export default EventList;
