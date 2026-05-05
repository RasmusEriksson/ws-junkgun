import express from "express"
import pool from "../config/db.js"
import {body, param, validationResult } from "express-validator"
import fs from "fs"
import set_piece_data from "../config/junk_functions.js"

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


        for (const piece of rows)  {
            rows = await set_piece_data(piece,rows)
        }

        console.log(rows)

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
            rows = await set_piece_data(rows[0],rows,true)
            console.log(rows)
            const piece = rows[0]

            return res.render("junk/junk.njk",
                {user: user, piece: piece}
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
        if (req.session.authenticated) {
            const errors = validationResult(req)
            if (!errors.isEmpty()){
                return res.status(400).json({erorrs: errors.array()})
            }

            const star_rating = req.body.star_rating
            const piece_id = req.params.id
            const user_id = req.session.user_id



            //Check if rating already exists if logged in
            
            var [rows] = await pool.query(`
                    SELECT rating.id, piece.rating, piece.rating_amount FROM rating
                    INNER JOIN piece ON rating.piece_id = piece.id
                    WHERE rating.user_id = ? AND rating.piece_id = ?
                `,[user_id, piece_id])
            
            if (rows.length > 0) {
                await pool.query(`
                        UPDATE rating
                        SET rating = ?
                        WHERE user_id = ? AND piece_id = ?
                    `,[star_rating, user_id, piece_id])
            }
            else {
                await pool.query(`
                        INSERT INTO rating (user_id, piece_id, rating) VALUES(?,?,?) 
                    `,[user_id, piece_id, star_rating])
            }
        }
        else {
            throw new Error("You need to be authenticated to post your rating")
        }
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