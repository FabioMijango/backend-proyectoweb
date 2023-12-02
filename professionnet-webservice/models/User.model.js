const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const crypto = require("crypto");

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    telephone: {
      type: String,
      required: true,
      unique: true,
    },
    birthDate: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true
    },
    municipality: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      required: true
    },
    habilities: {
      type: [],
      default: []
    },
    competences: {
      type: [],
      default: []
    },
    caracteristics: {
      type: [],
      default: []
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
    },
    tokens: {
      type: Array,
      default: [],
    },
    roles: {
      type: [],
      required: true,
      default: [],
    },
    savedVacants: {
      type: [Schema.Types.ObjectId],
      ref: "Vacant",
      default: [],
    },
    experience: {
      type: [{
        description: {
          type: String,
          required: true,
        },
        start: {
          type: Date,
          required: true,
        },
        end: {
          type: Date,
          required: true,
        },
      }],
      default: []
    },
    education: {
      type: [{
        level: {
          type: String,
          enum: ['initial_education', 'middle_education', 'higher_education'],
          required: true,
        },
        completed: {
          type: Boolean,
          required: true,
          default: false,
        },
      }],
      default: [{"level": "initial_education", "completed": false}, {"level": "middle_education", "completed": false}, {"level": "higher_education", "completed": false}],
      // validate: [arrayLimit, '{PATH} exceeds the limit of 3']
    },
    testimony: {
      type: {
        categoria: {
          type: String,
          enum: ['Crecimiento', 'Conectividad', ''],
        },
        message: {
          type: String,
        },
      },
      default: { categoria: '', message: '' }
    },
  },
  { timestamps: true }
);

UserSchema.methods = {
  encryptPassword: function (password) {
    if (!password) return "";
    try {
      const _password = crypto
        .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
        .toString("hex");
      return _password;
    } catch (error) {
      debug({ error });
    }
  },
  makeSalt: function () {
    return crypto.randomBytes(16).toString("hex");
  },
  comparePassword: function (password) {
    return this.encryptPassword(password) === this.hashedPassword;
  },
};

UserSchema.virtual("password").set(function (
  password = crypto.randomBytes(16).toString("hex")
) {
  this.salt = this.makeSalt();
  this.hashedPassword = this.encryptPassword(password);
});

module.exports = Mongoose.model("User", UserSchema);
