
const users = require("../controllers/user.controller.js")
const auth = require("../middlewares/auth.js")
const cache = require("../middlewares/cache.js")
var router = require("express").Router()

router
.route('/')
    .post(users.createUser)
    .get(auth, users.getUsers)


router
    .delete('/:id', auth, users.deleteUser)
    .patch('/:id', auth, users.updateUser)
    .get('/:id', auth, users.getUserById)

router.get('/registration-number/:number', auth, users.getUserByRegistrationNumber)
router.get('/account-number/:number', auth, users.getUserByAccountNumber)


module.exports = router