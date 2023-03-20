-- Populates the rooms table with the SUB meetings rooms from the sfss website
INSERT INTO rooms (
    building_name, room_number, hasProjector, hasWhiteboard, capacity) 
    VALUES 
    -- Floor 1: No meeting rooms
    -- Floor 2
    ('SUB', 2120, false, false, 20),
    ('SUB', 2410, true, true, 25),
    ('SUB', 2420, true, true, 22),
    ('SUB', 2440, true, true, 22),
    -- Floor 3
    ('SUB', 3210, true, true, 10),
    ('SUB', 3220, true, true, 10),
    ('SUB', 3230, true, true, 10),
    -- Floor 4
    ('SUB', 4001, true, false, 10),
    ('SUB', 4003, false, false, 6),
    ('SUB', 4005, true, false, 6),
    ('SUB', 4101, false, false, 6),
    ('SUB', 4103, false, false, 6),
    ('SUB', 4105, false, false, 6),
    ('SUB', 4107, true, false, 6),
    ('SUB', 4200, true, false, 28),
    ('SUB', 4311, true, false, 6),
    ('SUB', 4313, false, false, 6),
    ('SUB', 4315, false, false, 6),
    ('SUB', 4317, false, false, 6),
    ('SUB', 4322, false, false, 6),
    ('SUB', 4324, false, false, 6),
    ('SUB', 4325, false, false, 6),
    ('SUB', 4326, true, false, 6);
    -- Floor 5: No meeting rooms
