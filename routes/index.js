import express from "express"
import pool from "../config/db.js"

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