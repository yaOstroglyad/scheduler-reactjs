import React from "react";
import "./BookingTabs.css"


const BookingTabs = props => {
    return (
        <div className="bookings_tabs">
            <button className={props.activeOutputType === 'list' ? 'active' : ''}
                    onClick={props.onChange(this, 'list')}>List</button>
            <button className={props.activeOutputType === 'chart' ? 'active' : ''}
                    onClick={props.onChange(this, 'chart')}>Chart</button>
        </div>
    )
}

export default BookingTabs;
