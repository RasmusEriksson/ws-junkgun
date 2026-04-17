import express from "express"
import {body, param, validationResult} from "express-validator"

const router = express.Router()


router.get("/login",(req,res) => {
    res.render("login.njk")
})

router.get("/signin",(req,res) => {
    res.render("signin.njk")
})

router.post("/signin",
    body("username").trim().notEmpty().withMessage("username needed"),
    body("email").trim().notEmpty().withMessage("email needed"),
    body("password").notEmpty().withMessage("password needed"),
    body("password_confirm").notEmpty().withMessage("you need to confirm your password by writing it twice"),
    
    async (req,res,next) =>{
        res.json(req.body)
})

export default router