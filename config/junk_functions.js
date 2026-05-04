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
    var [ratings] = await pool.query(` 
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

export default async function set_piece_data(piece,rows) {
    const index = rows.indexOf(piece)
    const image_url = check_piece_img(piece.name)
    rows[index]["image_url"] = image_url
    const rating = await get_piece_rating(piece.id)
    const rating_rounded = Math.round(rating)
    rows[index]["rating"] = rating
    rows[index]["rating_rounded"] = rating_rounded
    return rows
}