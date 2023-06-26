const {mongoose} = require("mongoose")
const bcrypt = require("bcrypt")


const accountSchema = mongoose.Schema({
    accountId: {
      type: String,
      unique: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
    },
    lastLoginDateTime: Date,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
})


//hashpassword here
accountSchema.pre("save", function(next) {
  const currentAccount = this
  if (!currentAccount.isModified('password')) return next();
  bcrypt.genSalt(10, function(err, salt) {
    if(err) return next(err)

    bcrypt.hash(currentAccount.password, salt, function(err, hash) {
      if(err) return next(err)
      currentAccount.password = hash
      next()
    })
  })
})

accountSchema.pre("save", function() {
  this.accountId = this._id
})

accountSchema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.accountId = _id;
    delete object.password
    return object;
  });


accountSchema.set('autoIndex', true)



//hash password
module.exports = mongoose.model("AccountLogin", accountSchema)
