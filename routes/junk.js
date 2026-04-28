import express from "express"
import pool from "../config/db.js"
import {body, param, validationResult } from "express-validator"
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

        res.render("junk/alljunk.njk",
            { title: "Junkpieces", user: user, pieces: rows  }
        )
    }
    catch(err) {
        next(err)
    }
})


router.get("/:id", 
    param("id").isInt().withMessage("ID must be a whole integer!"),
    async (req, res, next) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(400).json({erorrs: errors.array()})
        }

        var user = null
        if (req.session.authenticated) {
            user = req.session
        }

        const pieceID = req.params.id

        var [rows] = await pool.query(` 
            SELECT * FROM piece
            WHERE piece.id = ?
            `,[pieceID])
        
        if (rows.length > 0) {
            const piece = rows[0]

            var image_url = check_piece_img(piece.name)

            return res.render("junk/junk.njk",
                {user: user, piece: piece , img: image_url}
            )
        }
        else {
            throw new Error("Piece not found")
        }

        
    }
    catch(err) {
        next(err)
    }
})

router.post("/:id",
    param("id").isInt().withMessage("ID must be a whole integer!"),
    body("star_rating").isInt().withMessage("RATING NOT INT"),

    async (req,res,next) => {

        const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(400).json({erorrs: errors.array()})
        }

        const star_rating = req.body.star_rating
        const piece_id = req.params.id
        /*
        var [rows] = pool.query(`
                SELECT * FROM rating
                WHERE rating.
            `)  */


        return res.redirect("../junk/"+String(req.params.id))
})

async function exists (path) {  
  try {
    await fs.access(path)
    return true
  } catch {
    return false
  }
}

export default router