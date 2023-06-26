const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
  userId: {
    type: String,
    unique: true,
  },
  fullName: {
    type: String,
    required: [true, "Full name is required"],
  },
  accountNumber: {
    type: String,
    required: [true, "Account number is required"],
    unique: true
  },
  emailAddress: {
    type: String,
    required: [true, "Email address is required"],
    unique: true
  },
  registrationNumber: {
    type: String,
    required: [true, "Registration number is required"],
    unique: true
  }
})

userSchema.set('autoIndex', true)

userSchema.pre("save", function() {
  this.userId = this._id
})

userSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.userId = _id;
  return object;
});



module.exports = mongoose.model("User", userSchema)