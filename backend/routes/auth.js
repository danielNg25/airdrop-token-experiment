const router = require("express").Router();
const User = require("../models/User");
const ethers = require("ethers")
const jwt = require("jsonwebtoken");

router.post("/register", async(req, res) => {
    try {
        const user = await User.findOne({ address: req.body.address.toLowerCase() });
        if (user) {
            res.status(406).json("Already register");
        } else {
            const newUser = new User({
                address: req.body.address.toLowerCase(),
                amount: 0,
                nonce: Math.floor(Math.random() * 10000),
                lastTime: 0,
            })
            const user = await newUser.save();
            res.status(200).json(user);
        }
    } catch (err) {
        res.status(500).json(err);
        console.log(err)
    }
})

router.post("/get-nonce", async(req, res) => {
    try {
        const user = await User.findOne({ address: req.body.address.toLowerCase() });

        if (!user) {
            res.status(406).json("First time login!");
        } else {
            const nonce = user.nonce;
            res.status(200).json({ nonce: nonce });
        }
    } catch (err) {
        res.status(500).json(err);
    }
})


router.post("/authenticate", async(req, res) => {
    try {
        const user = await User.findOne({ address: req.body.address.toLowerCase() });
        if (!user) {
            res.status(400).json("First time login!");
        } else {
            const msg = "Register to Truong's airdrop with nonce: " + user.nonce;
            const verifyAddress = ethers.utils.verifyMessage(msg, req.body.signature);
            if (verifyAddress.toLowerCase() === user.address.toLowerCase()) {
                const token = jwt.sign({ address: user.address }, process.env.JWT_TOKEN, { expiresIn: "1h" });
                nonceToUpdate = Math.floor(Math.random() * 10000);
                const updatedUser = await User.findByIdAndUpdate(
                    user._id, {
                        $set: { nonce: nonceToUpdate },
                    }, { new: true }
                );

                res.status(200).json({
                    accessToken: token
                });
            } else {
                res.status(401).json("Invalid signature!");
            }
        }


    } catch (err) {
        res.status(500).json(err);
    }
})
module.exports = router;