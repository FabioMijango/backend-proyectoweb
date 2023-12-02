const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;
const CATEGORYS = require("../data/Categorias.json")
const debug = require("debug")("app:models:Vacant.model");

const VacantSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    salary: {
      type: Number,
      required: true,
      min: 0,
    },
    competences: {
      type: String
    },
    caracteristics: {
      type: String
    },
    image: {
      type: String,
      required: true,
    },
    esPasantia: {
      type: Boolean,
      required: true,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      required: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    nominatedUsers: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    }
  },
  { timestamps: true }
);


module.exports = Mongoose.model("Vacant", VacantSchema);
