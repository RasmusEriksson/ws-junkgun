import express from "express"
import pool from "../config/db.js"
import {param, validationResult } from "express-validator"
import fs from "fs"

const router = express.Router()

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

            var image_url = "/images/noImage.jpg"
            var image_string = "/images/pieces/" + piece.name + ".jpg"
            console.log("THIS IS THE URL: ", image_string)

            if (fs.existsSync(image_string)){
                image_url = image_string
            }

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

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
}

export default router