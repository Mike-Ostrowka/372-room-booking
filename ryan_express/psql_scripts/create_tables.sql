-- CREATE tables
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL, 
    username varchar(50) NOT NULL, 
    password varchar(64) NOT NULL, 
    firstName varchar(50) NOT NULL, 
    lastName varchar(50) NOT NULL, 
    isStaff boolean NOT NULL, 
    PRIMARY KEY (user_id)
);

CREATE TABLE IF NOT EXISTS rooms (
    building_name varchar(20),
    room_number integer, 
    hasProjector boolean NOT NULL, 
    hasWhiteboard boolean NOT NULL, 
    capacity integer NOT NULL, 
    PRIMARY KEY (building_name, room_number)
);

CREATE TABLE IF NOT EXISTS room_bookings (
    booking_id serial, 
    start_datetime timestamp NOT NULL, 
    end_datetime timestamp NOT NULL,
    duration integer NOT NULL, 
    num_occupants integer NOT NULL, 
    building_name varchar(20) NOT NULL, 
    room_number integer NOT NULL, 
    user_id SERIAL NOT NULL, 
    PRIMARY KEY (booking_id), 
    FOREIGN KEY (building_name, room_number) REFERENCES rooms(building_name, room_number), 
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);


