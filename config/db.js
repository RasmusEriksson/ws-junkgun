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
const add = true
if (add) {
    //ADD BASIC PIECE TO DATABASE

    db.prepare(`DELETE FROM piece`).run()
    db.prepare(`VACUUM`).run()
    
    const insertPIECE = db.prepare(`
        INSERT OR IGNORE INTO piece (id, name, quality, description, weight, connections, rating, rating_amount) VALUES
        (1, 'Handle', 1, 'The mechanism fits nicely in your hand, It looks like it can activate other pieces if connected to it.', 3.0, 3, 0, 0),
        (2, 'Pressure Cannon', 2, 'P.C for short, its mechanism allows it to pump out compact bubbles of pure air pressure which explode upon impact.', 2.5, 2, 0, 0),
        (3, 'Skateboard', 3, 'This is SICK AS FRICK hoooolyyyyy dude', 3.0, 3, 0, 0),
        (4, 'Stupid', 4, 'An uncontrollable sensation of RAGE and HATRED overcomes you, your circuits start overheating from the immense WRATH this THING gives you. Probably the worst thing you’ve ever seen, at least that’s what your sensors tell you.', 5.0, 100, 0, 0),
        (5, 'Darter', 1, 'It resembles a poorly carved wooden skull of a long since gone animal, it appears to be made by something with dexterous hands.', 4.0, 2, 0, 0),
        (6, 'Fish Tail', 2, 'It’s been in the pile for so long that mechanical worms have eaten out everything remotely edible from the spine, all that remains are the corrosive leftovers', 2.0, 0, 0, 0),
        (7, 'Banaba', 1, 'The outer shell has somehow hardened to be like stone, you can hear the old rotten inside move around within it.', 1.0, 3, 0, 0),
        (8, 'Conditioner', 1, 'It’s still cold somehow despite not working, it appears to be good to keep mechanisms running smoothly.', 2.5, 3, 0, 0),
        (9, 'Pipe', 1, 'It’s a pipe, what more do you need to know?', 1.0, 2, 0, 0),
        (10, 'Box', 1, 'Big, clunky and light in weight. Kind of like a balloon, but not similar to it at all.', 1.5, 4, 0, 0),
        (11, 'Grilled Cheese', 2, 'Incredibly stale yet somehow very greasy.', 3.0, 0, 0, 0),
        (12, 'Quickie', 2, 'More fragile and heavy than the alternatives but comes with an automatic firing system making it both quick and convenient to use', 5.0, 1, 0, 0),
        (13, 'Shrew', 3, 'It appears to be a plush with highly corrosive stuffing, you assume it’s because you’re not supposed to touch it, but you want to do it anyway.', 3.0, 2, 0, 0),
        (14, 'Welded Barrel', 2, 'Sturdy and heavy, it’s manufactured well to have lasted this long and still be of this quality', 4.0, 2, 0, 0),
        (15, 'Bad Flask', 3, 'The liquid inside is very thick and sensitive, you feel like the slightest spark could explode the entire thing.', 5.0, 2, 0, 0),
        (16, 'The Slug', 3, 'The oogly googly, glub glub glub gooo', 4.0, 0, 0, 0),
        (17, 'Battery', 1, 'Still juiced up, it’s quite big and heavy however.', 2.0, 2, 0, 0),
        (18, 'Can of Rage', 2, 'I can’t believe they have it, the substance of anger in a can, canned rage. Remarkable.', 3.0, 3, 0, 0),
        (19, 'Chunk', 1, 'It looks like it’s a mismatch of folded metal platings and dried organic matter, it must’ve been compressed under the trash piles for decades.', 2.5, 6, 0, 0),
        (20, 'Donut', 2, 'Used to be full of calories, still nutritious in a bad way anyhow.', 2.5, 3, 0, 0),
        (21, 'Ube Juice', 1, 'You don’t know what an Ube is, but you don’t know why anybody would make it into a juice, at least it looks pretty.', 2.5, 2, 0, 0),
        (22, 'Brick', 1, 'Dense but light, excellent for throwing with the intent to kill', 3.0, 3, 0, 0),
        (23, 'Stone Fist', 3, 'It appears to be a remnant of an old statue, it’s incredibly heavy but can definitely pack a punch', 5.0, 5, 0, 0),
        (24, 'Mini Cannon', 1, 'A simple mechanism made from pipes and gunpowder, it’s a marvel that it works.', 4.0, 1, 0, 0),
        (25, 'Big Nail', 1, 'A nail that shoots smaller nails… I wonder who had that bright idea.', 3.0, 0, 0, 0);
    `)

    //db.prepare(`DELETE FROM piece WHERE rowid = 5;`).run()
    //db.prepare(`VACUUM`).run()

    insertPIECE.run()
    
    //ADD RATING TO DATABASE
    /*
    const insertRATING = db.prepare(`
        INSERT INTO rating (id, user_id, piece_id, rating) VALUES
        (1, 2, 1, 2);
    `)

    insertRATING.run()*/

    db.prepare(`DELETE FROM stat`).run()
    db.prepare(`VACUUM`).run()

    //ADD STATBASE TO DATABASE
    const insertSTATBASE = db.prepare(`
        INSERT OR IGNORE INTO stat (id, name) VALUES
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

    insertSTATBASE.run()

    //ADD NEW PIECE STAT TO DATABASE
    
    db.prepare(`DELETE FROM stat_piece`).run()
    db.prepare(`VACUUM`).run()
    
    
    const insertSTAT = db.prepare(`
        INSERT OR IGNORE INTO stat_piece ( piece_id, stat_id, value, con_range) VALUES
        ( 1, 3, '1.0', '0'),
        ( 2, 1, '0', '0'),
        ( 2, 3, '1.5', '0'),
        ( 2, 6, '15.0', '0'),
        ( 2, 12, '', '0'),
        ( 3, 2, '+25%', '2'),
        ( 3, 9, '+4.0', '0'),
        ( 4, 8, '8', '2'),
        ( 5, 1, '1', '0'),
        ( 5, 3, '1.0', '0'),
        ( 5, 8, '2', '0'),
        ( 6, 8, '4', '1'),
        ( 7, 7, '+10', '0'),
        ( 8, 2, '+15%', '3'),
        ( 9, 10, '+15.0', '3'),
        ( 11, 2, '+30%', '3'),
        ( 12, 3, '0.5', '0'),
        ( 12, 11, '', '0'),
        ( 13, 8, '2.0', '2'),
        ( 14, 1, '12', '0'),
        ( 14, 3, '2.0', '0'),
        ( 14, 6, '5.0', '0'),
        ( 15, 1, '20', '0'),
        ( 15, 3, '3.0', '0'),
        ( 15, 6, '10.0', '0'),
        ( 16, 5, '+6', '3'),
        ( 16, 10, '-30.0', '3'),
        ( 17, 9, '+2.5', '0'),
        ( 18, 5, '+3.0', '2'),
        ( 19, 10, '-5.0', '2'),
        ( 20, 7, '+20', '0'),
        ( 20, 10, '+20', '2'),
        ( 21, 5, '+1', '3'),
        ( 22, 6, '3.5', '2'),
        ( 23, 6, '8.5', '2'),
        ( 24, 1, '4', '0'),
        ( 24, 3, '1.0', '0'),
        ( 25, 3, '0.65', '0'),
        ( 25, 1, '2', '0');
    `)

    insertSTAT.run()
    
    //ADD NEW USER TO DATABASE
    /*
    const insertUSER = db.prepare(`
        INSERT INTO user (id, name, email, password_hash) VALUES
        (2, 'test', 'test', '$2b$10$JWPdbJN4eXWWxpX9Z6oV7.VZBN1HF5gcdWsGq7lo9PPvrDF.pfzLG');`);
    
    insertUSER.run()*/
}

export default db;