import express from "express"
import pool from "../config/db.js"
import fs from "fs"

const router = express.Router()


function check_piece_img(piece_name) {
    var image_url = "/images/noImage.jpg"
    var image_string = "/images/pieces/" + piece_name + ".jpg"

    if (fs.existsSync("./public"+image_string)){
        image_url = image_string
    }
    return image_url
}

router.get("/", async (req, res, next) => {
    
    try {

        var user = null
        if (req.session.authenticated) {
            user = req.session
        }

        var [rows] = await pool.query(` 
            SELECT * FROM piece
            ORDER BY rating DESC
            `)
        
        rows.forEach((piece,index) => {
            var image_url = check_piece_img(piece.name)
            rows[index]["image_url"] = image_url
        })

        console.log(rows)
        res.render("index.njk",
            { title: "Junkgun", message: "let's rate some stuff", user: user, pieces: rows  }
        )
    }
    catch(err) {
        next(err)
    }
})


export default router