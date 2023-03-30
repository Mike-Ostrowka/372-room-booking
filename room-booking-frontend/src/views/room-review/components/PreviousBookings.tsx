import { useEffect, useState } from "react";
import PreviousBookingTable from "./PreviousBookingTable";

const PreviousBookings = (setBookingID:any) => {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        
    });

    return(
        <div>
            <PreviousBookingTable/>
        </div>
    );
};

export default PreviousBookings;