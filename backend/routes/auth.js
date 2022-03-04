const router = require("express").Router();
const User = require("../models/User");

router.post("/get-nonce", async(req, res) => {
    try {
        const user = await User.findOne({ address: req.body.address });
        !user && res.status(400).json("First time login!");

        const nonce = user.nonce;
        res.status(200).json({ nonce: nonce });

    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;