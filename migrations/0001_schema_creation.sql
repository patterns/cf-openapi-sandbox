-- Migration number: 0001 	 2025-05-06T22:20:57.448Z


DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rawdata TEXT NOT NULL,
    created TEXT DEFAULT CURRENT_TIMESTAMP,
    email AS (json_extract(rawdata, '$.email')) STORED,
    first_name AS (json_extract(rawdata, '$.firstName')) STORED,
    last_name AS (json_extract(rawdata, '$.lastName')) STORED,
    registered AS (json_extract(rawdata, '$.registered')) STORED,
    issue_date AS (json_extract(rawdata, '$.issueDate')) STORED,
    is_enabled AS (json_extract(rawdata, '$.isEnabled')) STORED,
    public_key AS (json_extract(rawdata, '$.publicKey')) STORED,
    qr_code AS (json_extract(rawdata, '$.qrCode')) STORED,
    last_online AS (json_extract(rawdata, '$.lastOnline')) STORED,
    "identity" AS (json_extract(rawdata, '$.identity')) STORED
);
DROP TABLE IF EXISTS measurement;
CREATE TABLE IF NOT EXISTS measurement (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rawdata TEXT NOT NULL,
    created TEXT DEFAULT CURRENT_TIMESTAMP,
    latitude AS (json_extract(rawdata, '$.latitude')) STORED,
    longitude AS (json_extract(rawdata, '$.longitude')) STORED,
    "timestamp" AS (json_extract(rawdata, '$.timestamp')) STORED,
    upload_speed AS (json_extract(rawdata, '$.upload_speed')) STORED,
    download_speed AS (json_extract(rawdata, '$.download_speed')) STORED,
    ping AS (json_extract(rawdata, '$.ping')) STORED,
    cell_id AS (json_extract(rawdata, '$.cell_id')) STORED,
    device_id AS (json_extract(rawdata, '$.device_id')) STORED,
    device_type AS (json_extract(rawdata, '$.device_type')) STORED,
    "group" AS (json_extract(rawdata, '$.group')) STORED,
    mid AS (json_extract(rawdata, '$.mid')) STORED,
    show_data AS (json_extract(rawdata, '$.show_data')) STORED
);
DROP TABLE IF EXISTS "admin";
CREATE TABLE IF NOT EXISTS "admin" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rawdata TEXT NOT NULL,
    created TEXT DEFAULT CURRENT_TIMESTAMP,
    "uid" AS (json_extract(rawdata, '$.uid')) STORED,
    token AS (json_extract(rawdata, '$.token')) STORED,
    "exp" AS (json_extract(rawdata, '$.exp')) STORED
);
DROP TABLE IF EXISTS "signal";
CREATE TABLE IF NOT EXISTS "signal" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rawdata TEXT NOT NULL,
    created TEXT DEFAULT CURRENT_TIMESTAMP,
    latitude AS (json_extract(rawdata, '$.latitude')) STORED,
    longitude AS (json_extract(rawdata, '$.longitude')) STORED,
    "timestamp" AS (json_extract(rawdata, '$.timestamp')) STORED,
    dbm AS (json_extract(rawdata, '$.dbm')) STORED,
    level_code AS (json_extract(rawdata, '$.level_code')) STORED,
    cell_id AS (json_extract(rawdata, '$.cell_id')) STORED,
    device_id AS (json_extract(rawdata, '$.device_id')) STORED,
    device_type AS (json_extract(rawdata, '$.device_type')) STORED,
    "group" AS (json_extract(rawdata, '$.group')) STORED,
    mid AS (json_extract(rawdata, '$.mid')) STORED,
    show_data AS (json_extract(rawdata, '$.show_data')) STORED
);

DROP TABLE IF EXISTS sites;
CREATE TABLE IF NOT EXISTS sites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rawdata TEXT NOT NULL,
    created TEXT DEFAULT CURRENT_TIMESTAMP,
    latitude AS (json_extract(rawdata, '$.latitude')) STORED,
    longitude AS (json_extract(rawdata, '$.longitude')) STORED,
    "status" AS (json_extract(rawdata, '$.status')) STORED,
    address AS (json_extract(rawdata, '$.address')) STORED,
    cell_id AS (json_extract(rawdata, '$.cell_id')) STORED,
    color AS (json_extract(rawdata, '$.color')) STORED,
    boundary AS (json_extract(rawdata, '$.boundary')) STORED,
    "name" AS (json_extract(rawdata, '$.name')) STORED
);
