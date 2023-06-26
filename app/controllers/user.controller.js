const req = require("express/lib/request")
const User = require("../models/user")
const Account = require("../models/account")
const cache = require("../middlewares/cache.js")

exports.createUser = async (req, res) => {
    if (!req) {
        res.status(400).json({
            message: "Empty request body"
        })
    }

    try {
        //validate things
        const user = await User.findOne({ emailAddress: req.body.emailAddress })
        if (!user) {
            const user = await User.create({
                fullName: req.body.fullName,
                emailAddress: req.body.emailAddress,
                accountNumber: req.body.accountNumber,
                registrationNumber: req.body.registrationNumber,
            })

            await Account.create({
                userName: req.body.userName,
                password: req.body.password,
                lastLoginDateTime: Date.now(),
                userId: user._id
            })

            res.status(201).json({
                data: user
            })
        } else {
            res.status(400).json({
                message: "Email address already registered"
            })
        }
    } catch (err) {
        res.status(400).json({
            message: "Something went wrong"
        })
    }
}

exports.getUsers = async (req, res) => {
    try {
        const cachedData = cache.getCached(`redis_allusers`)

        if (cachedData) {
            res.status(200).json({
                data: cachedData
            })
        }

        const users = await User.find()

        cache.caching(
            'redis_allusers',
            JSON.stringify(users)
        )

        res.status(200).json({
            data: users
        })
    } catch(err) {
        res.status(400).json({
            message: "Something went wrong"
        })
    }
}

exports.getUserById = async (req, res) => {
    const { id } = req.params
    const user = await User.findById(id)

    if (!user) {
        res.status(400).json({
            message: "User not found"
        })
    } else {
        res.json({
            data: user
        })
    }
}

exports.updateUser = async (req, res) => {
    const { id } = req.params
    try {
        const user = await User.findByIdAndUpdate(id, req.body, { new: true })
        res.status(200).json({
            data: user
        })

    } catch (err) {
        res.status(400).json({
            message: err
        })
    }
}

exports.deleteUser = async (req, res) => {
    const { id } = req.params
    try {
        const user = await User.findByIdAndDelete(id)
        const account = await Account.findOneAndDelete({ "userId": id })
        res.status(200).json({
            message: `Successfully deleted user with id : ${id}`
        })

    } catch (err) {
        res.status(400).json({
            message: err
        })
    }
}

exports.getUserByAccountNumber = async (req, res) => {
    const { number } = req.params
    const user = await User.findOne({ accountNumber: number })
    if (!user) {
        res.status(400).json({
            message: "User not found"
        })
    } else {
        res.json({
            data: user
        })
    }
}

exports.getUserByRegistrationNumber = async (req, res) => {
    const { number } = req.params

    const user = await User.findOne({ registrationNumber: number })

    if (!user) {
        res.status(400).json({
            message: "User not found"
        })
    } else {
        res.json({
            data: user
        })
    }

}