/*import mysql from "mysql2/promise"

const pool = mysql.createPool({
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
    charset: 'utf8mb4',
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    port: process.env.DATABASE_PORT,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE,
})

export default pool*/

import Database from 'better-sqlite3';

const db = new Database('foobar.db');
db.pragma('journal_mode = WAL');

// Skapa tabellen items om den inte redan finns
db.exec(` CREATE TABLE IF NOT EXISTS piece (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name varchar(55) DEFAULT NULL,
    quality int DEFAULT NULL,
    description varchar(550) DEFAULT NULL,
    weight float DEFAULT NULL,
    connections int DEFAULT NULL,
    rating float DEFAULT NULL,
    rating_amount int DEFAULT NULL
    );
`);

db.exec(` 
    CREATE TABLE IF NOT EXISTS rating (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id int NOT NULL,
    piece_id int NOT NULL,
    rating float NOT NULL DEFAULT '0'
    );
`);


db.exec(` 
    CREATE TABLE IF NOT EXISTS stat (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name varchar(55) NOT NULL
    );
`);


db.exec(`  
    CREATE TABLE IF NOT EXISTS stat_piece (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    piece_id int NOT NULL,
    stat_id int NOT NULL,
    value varchar(55) NOT NULL,
    con_range varchar(55) NOT NULL DEFAULT '0'
    );
`);

db.exec(`  
    CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name varchar(55) NOT NULL,
    email varchar(255) NOT NULL,
    password_hash varchar(255) NOT NULL
    );
`);


//Thing for adding data V V V V V V
const add = false
if (add) {
    //ADD BASIC PIECE TO DATABASE
    
    /*const insertPIECE = db.prepare(`
        INSERT OR IGNORE INTO piece (id, name, quality, description, weight, connections, rating, rating_amount) VALUES
        (2, 'Pressure Cannon', 2, 'P.C for short, its mechanism allows it to pump out compact bubbles of pure air pressure which explode upon impact.', 2.5, 2, 0, 0);
    `)*/

    //db.prepare(`DELETE FROM piece WHERE rowid = 5;`).run()
    //db.prepare(`VACUUM`).run()

    //insertPIECE.run()
    
    //ADD RATING TO DATABASE
    /*
    const insertRATING = db.prepare(`
        INSERT INTO rating (id, user_id, piece_id, rating) VALUES
        (1, 2, 1, 2);
    `)

    insertRATING.run()*/

    //ADD STATBASE TO DATABASE
    /*
    const insertSTATBASE = db.prepare(`
        INSERT INTO stat (id, name) VALUES
        (1, 'dmg'),
        (2, 'fir'),
        (3, 'rel'),
        (4, 'con_range'),
        (5, 'dmg_up'),
        (6, 'kb'),
        (7, 'hp'),
        (8, 'poi'),
        (9, 'spd'),
        (10, 'vel'),
        (11, 'hold'),
        (12, 'no_dmg');
    `)

    insertSTATBASE.run()*/

    //ADD NEW PIECE STAT TO DATABASE
    
    /*
    const insertSTAT = db.prepare(`
        INSERT OR IGNORE INTO stat_piece ( piece_id, stat_id, value, con_range) VALUES
        ( 2, 1, '0.0', '0'),
        ( 2, 3, '1.5', '0'),
        ( 2, 6, '15.0', '0'),
        ( 2, 12, 'no_dmg', '0');
    `)

    insertSTAT.run()*/
    
    //ADD NEW USER TO DATABASE
    /*
    const insertUSER = db.prepare(`
        INSERT INTO user (id, name, email, password_hash) VALUES
        (2, 'test', 'test', '$2b$10$JWPdbJN4eXWWxpX9Z6oV7.VZBN1HF5gcdWsGq7lo9PPvrDF.pfzLG');`);
    
    insertUSER.run()*/
}

export default db;