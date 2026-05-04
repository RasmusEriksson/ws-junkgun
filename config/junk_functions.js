import pool from "../config/db.js"
import fs from "fs"



function check_piece_img(piece_name) {
    var image_url = "/images/noImage.jpg"
    var image_string = "/images/pieces/" + piece_name + ".jpg"

    if (fs.existsSync("./public"+image_string)){
        image_url = image_string
    }
    return image_url
}

async function get_piece_rating(piece_id) {
    const [ratings] = await pool.query(` 
        SELECT * FROM rating
        WHERE rating.piece_id = ?
    `,[piece_id])

    var rating_value = 0
    var amount = ratings.length

    ratings.forEach((rating) => {
        rating_value += rating.rating
    })

    if (amount <= 0) {
        amount = 1
    }
    
    return Math.round((rating_value/amount)*10)/10
}

async function get_piece_stats(piece_id) {
    const [stats] = await pool.query(`
        SELECT  stat_piece.value, stat_piece.con_range, stat.name
        FROM stat_piece
        JOIN stat ON stat_piece.stat_id = stat.id
        WHERE stat_piece.piece_id = ?
        `,[piece_id])
    
    return stats
}

export default async function set_piece_data(piece,rows,get_stats = false) {
    
    const index = rows.indexOf(piece)
    const image_url = check_piece_img(piece.name)
    const rating = await get_piece_rating(piece.id)
    const rating_rounded = Math.round(rating)
    
    rows[index]["image_url"] = image_url
    rows[index]["rating"] = rating
    rows[index]["rating_rounded"] = rating_rounded

    if (get_stats) {
        const stats = await get_piece_stats(piece.id)
        rows[index]["stats"] = stats
    }
    
    return rows
}