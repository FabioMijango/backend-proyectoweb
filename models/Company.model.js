const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const crypto = require("crypto");

// companyName, email, ruc, telephone, address, password, roles
const CompanySchema = new Schema(
    {
        companyName: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            minlength: 3,
            maxlength: 20,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        ruc: {
            type: Number,
            required: true,
            unique: true,
        },
        telephone: {
            type: String,
            required: true,
            unique: true,
        },
        department: {
          type: String,
          required: true
        },
        municipality: {
          type: String,
          required: true
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
    },
    { timestamps: true }
);


CompanySchema.methods = {
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
  
  CompanySchema.virtual("password").set(function (
    password = crypto.randomBytes(16).toString("hex")
  ) {
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  });

module.exports = Mongoose.model("Company", CompanySchema);  