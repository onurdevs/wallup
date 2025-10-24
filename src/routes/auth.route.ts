import { Router } from "express";

const router = Router()
router.post("/register", (req, res) => {
    res.send("register a geldik")
});
router.post("/login", (req, res) => {
    const {email, password} = req.body;
    res.json({
        message:"geldi",
        result:{
            email: email,
            password: password
        }
    })
})

export default router;