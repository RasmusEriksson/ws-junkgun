import express from "express"

const router = express.Router()

router.get("/", (req, res) => {
    var username = "not logged in"
    if (req.session.userId) {
        username = req.session.username
    }

    res.render("index.njk",
        { title: "Node js startrepo", message: "Använd det här repot som en grund för dina projekt.",username: username }
    )
})

router.get('/error', (req, res) => {
    throw new Error('Test error')
})

export default router