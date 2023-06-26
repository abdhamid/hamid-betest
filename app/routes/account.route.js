
const accounts = require("../controllers/account.controller")
const auth = require("../middlewares/auth")

var router = require("express").Router()

router
    .post('/login', accounts.login)

router
    .get('/last-login', auth, accounts.getAccountByLastLoginDate)


router
    .get('/', auth, accounts.getAccounts)
    .post('/', auth, accounts.createAccount)

router
    .delete('/:id', auth, accounts.deleteAccount)
    .patch('/:id', auth, accounts.updateAccountPassword)
    .get('/:id', auth, accounts.getAccountById)



module.exports = router