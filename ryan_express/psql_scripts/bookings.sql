-- Populate the bookings table with dummy bookings
INSERT INTO room_bookings (
    start_datetime, end_datetime, duration, num_occupants, building_name, room_number, user_id) 
    VALUES 
    ('2023-03-21 14:00', '2023-03-21 16:00', 120, 10, 'SUB', 4001, 1),
    ('2023-03-21 08:00', '2023-03-21 09:00', 60, 8, 'SUB', 4001, 1),
    ('2023-03-21 14:00', '2023-03-21 16:00', 120, 5, 'SUB', 3210, 1),
    ('2023-03-21 08:00', '2023-03-21 09:00', 60, 4, 'SUB', 3210, 1),
    ('2023-03-21 14:00', '2023-03-21 16:00', 120, 5, 'SUB', 4003, 1),
    ('2023-03-21 08:00', '2023-03-21 09:00', 60, 4, 'SUB', 4003, 1);