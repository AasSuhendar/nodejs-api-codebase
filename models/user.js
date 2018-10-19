var mongoose = require('mongoose')
var bcrypt = require('bcrypt-nodejs')
var Schema = mongoose.Schema

var UserSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phone_number: {
    type: String,
  // required: true
  },
  user_type: {
    type: [String]
  },
  incubator_type: {
    type: String,
  // required: true
  },
  verified: {
    type: Boolean
  },
  verified_at: {
    type: Date
  },
  minio: {
    type: Boolean
  },
  openshift: {
    type: Boolean
  },
  verified_aws: {
    type: Boolean
  },
  token: {
    type: String
  },
  expired: {
    type: Date
  },
  ordered_openshift: [{ type: Schema.Types.ObjectId, ref: 'Order_Openshift' }],
  ordered_aws: [{ type: Schema.Types.ObjectId, ref: 'Order_AWS' }],
  ordered_minio: [{ type: Schema.Types.ObjectId, ref: 'Order_Minio' }],
  created_at: {
    type: Date,
    default: Date.now
  }
})

UserSchema.pre('save', function (next) {
  var user = this
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return next(err)
      }
      bcrypt.hash(user.password, salt, null, function (err, hash) {
        if (err) {
          return next(err)
        }
        user.password = hash
        next()
      })
    })
  } else {
    return next()
  }
})

UserSchema.methods.comparePassword = function (passw, cb) {
  bcrypt.compare(passw, this.password, function (err, isMatch) {
    if (err) {
      return cb(err)
    }
    cb(null, isMatch)
  })
}

UserSchema.methods.getUserByEmail = function (emailUser, cb) {
  return this.model('User').find({email: emailUser}, cb)
}

module.exports = mongoose.model('User', UserSchema)
