import React from "react";
import "./BookingTabs.css"


const BookingTabs = props => (
    <div className="bookings_tabs">
        <button className={props.activeOutputType === 'list' ? 'active' : ''}
                onClick={props.onChange.bind(this, 'list')}>List</button>
        <button className={props.activeOutputType === 'chart' ? 'active' : ''}
                onClick={props.onChange.bind(this, 'chart')}>Chart</button>
    </div>
)

export default BookingTabs;
