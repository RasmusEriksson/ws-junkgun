import express from "express"
import pool from "../config/db.js"
import db from '../config/db.js';
import fs from "fs"
import set_piece_data from "../config/junk_functions.js"

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

        var rows = db.prepare(` 
            SELECT * FROM piece
            LIMIT 3
            `).all()
        
        console.log(rows)
        
        for (const piece of rows)  {
            rows = set_piece_data(piece,rows)
        }

        res.render("index.njk",
            { title: "Junkgun", message: "let's rate some stuff", user: user, pieces: rows  }
        )
    }
    catch(err) {
        next(err)
    }
})


export default router