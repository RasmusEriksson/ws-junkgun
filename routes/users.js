import express, { json } from "express"
import bcrypt from "bcrypt"
import {body, param, validationResult} from "express-validator"
import pool from "../config/db.js"

const router = express.Router()



// ALL OF THE ROUTES FOR LOGGING IN

router.get("/login",(req,res) => {
    res.render("users/login.njk")
})

router.post("/login", 

    body("username").trim().notEmpty().withMessage("username needed"),
    body("password").notEmpty().withMessage("password needed"),

    async (req,res,next) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()){
                return res.status(404).json({errors: errors.array()})
            }

            const username = req.body.username
            const password = req.body.password

            const [rows] = await pool.query(
            `   
                SELECT * FROM user
                WHERE user.name = ?
            `, [username]
            )
            const user = rows[0]

            if (!user){
                return res.status(401).json({ error: "INCORRECT USERNAME OR PASSWORD" })
            }

            const isMatch = await bcrypt.compare(password,user.password_hash)
            if (!isMatch) {
                return res.status(401).json({ error: "INCORRECT USERNAME OR PASSWORD" })
            }

            req.session.authenticated = true
            req.session.userId = user.id
            req.session.username = user.name

            return res.redirect("/")
        }
        catch(err) {
            next(err)
        }
        

})



// ALL OF THE ROUTES FOR SIGNING IN


router.get("/signin",(req,res) => {
    res.render("users/signin.njk")
})

router.post("/signin",
    body("username").trim().notEmpty().withMessage("username needed"),
    body("email").trim().notEmpty().withMessage("email needed"),
    body("password").notEmpty().withMessage("password needed"),
    body("password_confirm").notEmpty().withMessage("you need to confirm your password by writing it twice"),

    async (req,res,next) =>{
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()){
                return res.status(404).json({errors: errors.array()})
            }

            const username = req.body.username
            const email = req.body.email
            const password = req.body.password
            const password_confirm = req.body.password_confirm

            const [already_exists_rows] = await pool.query(
                `
                SELECT * FROM user
                WHERE user.name = ? OR user.email = ?
                `, [username,email])
            
            if (already_exists_rows.length > 0){
                return res.json({message:"Either your username or email is already taken!"})
            }

            if  (password === password_confirm){
                const saltRounds = 10
                const hash = await bcrypt.hash(password,saltRounds)

                await pool.query(
                    `
                        INSERT INTO user (name, email, password_hash) VALUES (?,?,?)
                    `,[username,email,hash])

                return res.redirect("/")
            }
            else {
                return res.json({message:"Your passwords didnt match!"})
            }
        }
        catch(err) {
            console.error(err)
            res.status(500).json({ error: "Något gick fel"})
        }
})

export default router