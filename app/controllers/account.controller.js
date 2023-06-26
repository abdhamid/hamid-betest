const Account = require("../models/account")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

exports.login = async (req, res) => {
    const {username, password} = req.body

    const account = await Account.findOne({userName: username})
    
    //change this using encryption
    if(account && await bcrypt.compare(password, account.password)) {
        //change last login
        account.lastLoginDateTime = Date.now()
        account.save()

        //generate token
        const token = jwt.sign(
            {account},
            process.env.API_SECRET,
            {
                expiresIn: '1h'
            }
        )
        res.status(200).json({
            message: "Login successful",
            accessToken: token
        })
    } else {
        res.status(400).json({
            message: "Invalid username/password"
        })
    }
}

exports.getAccountByLastLoginDate = async (req, res) => {
    const days = parseInt(req.query.days) || 3
    const daysFromToday = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    const accounts = await Account.find({
        lastLoginDateTime: {$lte: daysFromToday}
    })
    try {
        res.status(200).json({
            data: accounts
        })
    } catch (error) {
        res.status(400).json({error})
    }
}

exports.createAccount = async (req, res) => {

    //validate things
    const account = await Account.create({
          userName: req.body.userName,
          password: req.body.password,
          lastLoginDateTime: Date.now(),
          userId: null
    })

    res.status(201).json({
        data: account
    })
}

exports.getAccounts = async (req, res) => {
    const accounts = await Account.find()

    res.status(200).json({
        data: accounts
    })
}

exports.getAccountById  = async (req, res) => {
    const { id }  = req.params
    const account = await Account.findById(id)
    
    if (!account) {
        res.status(400).json({
            message: "Account not found"
        })    
    } else {
        res.json({
            data: account
        })
    }
}

exports.updateAccountPassword  = async (req, res) => {
    const { id }  = req.params
    const {password} = req.body.password
    try {
        const account = await Account.findByIdAndUpdate(id, password, {new: true})
        res.status(200).json({
            message: "Password successfully updated"
        })

    } catch (err) {
        res.status(400).json({
            message: err
        })
    }
}

exports.deleteAccount  = async (req, res) => {
    const { id }  = req.params
    try {
        await Account.findOneAndDelete({"accountId": id})
        res.status(200).json({
            message: `Successfully deleted account with id : ${id}`
        })

    } catch (err) {
        res.status(400).json({
            message: err
        })
    }
}

