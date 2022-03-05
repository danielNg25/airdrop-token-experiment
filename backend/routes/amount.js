const router = require("express").Router();
const User = require("../models/User");
const ethers = require("ethers")
const jwt = require("jsonwebtoken");
const DAY_UNIX = 86400;

router.get("/:address", async(req, res) => {
    try {
        const user = await User.findOne({ address: req.params.address.toLowerCase() });
        const tokenAmount = user.amount;
        res.status(200).json({ amount: tokenAmount, lastTime: user.lastTime });

    } catch (err) {
        res.status(500).json(err);
    }
})

router.put("/", async(req, res) => {
    try {
        const token = req.headers['x-access-token'].trim();
        let userAddress;
        jwt.verify(token, process.env.JWT_TOKEN, (err, decoded) => {
            if (err) {
                throw ("Invalid Token");
            } else {
                userAddress = decoded.address;
            }
        });
        const user = await User.findOne({ address: userAddress.toLowerCase() });
        console.log(Math.floor(user.lastTime));

        if (Math.floor(Date.now() / 1000) - user.lastTime > DAY_UNIX) {
            updateAmount = user.amount + req.body.amount;
            const updatedUser = await User.findByIdAndUpdate(
                user._id, {
                    $set: { amount: updateAmount, lastTime: Math.floor(Date.now() / 1000) },
                }, { new: true }
            );
            res.status(200).json(updatedUser);
        } else {
            res.status(406).json("It's not time to register yet!");
        }
    } catch (err) {
        if (err == "Invalid Token") {
            res.status(401).json(err);
        } else {
            res.status(500).json(err);
        }

    }
})

router.post("/claim", async(req, res) => {
    try {
        const token = req.headers['x-access-token'].trim();
        let userAddress;
        jwt.verify(token, process.env.JWT_TOKEN, (err, decoded) => {
            if (err) {
                throw ("Invalid Token");
            } else {
                userAddress = decoded.address;
            }
        });
        const user = await User.findOne({ address: userAddress.toLowerCase() });
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
        const signature = await wallet._signTypedData(
            // Domain
            {
                name: "Truong",
                version: "1.0.0",
                chainId: "97",
                verifyingContract: '0x4308251514f5215504ea644A936167adDe994d91'
            },
            // Types
            {
                TruongsAirDrop: [
                    { name: "amount", type: "uint256" },
                    { name: "account", type: "address" }
                ],
            },
            // Values
            {
                amount: user.amount,
                account: user.address
            }
        )

        res.status(200).json(signature);
    } catch (err) {
        if (err == "Invalid Token") {
            res.status(401).json(err);
        } else {
            res.status(500).json(err);
        }
    }


})
module.exports = router;