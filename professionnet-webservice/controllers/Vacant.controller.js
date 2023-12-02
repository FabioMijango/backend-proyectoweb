const { populate } = require("../models/User.model");
const User = require("../models/User.model");
const Vacant = require("../models/Vacant.model");
const debug = require("debug")("app:vacant-controller");

const controller = {};

controller.save = async (req, res, next) => {
  //Premisa -> La ruta debe estar autenticada

  try {
    const {
      name,
      description,
      salary,
      image,
      esPasantia,
      category,
      competences,
      caracteristics,
    } = req.body;
    const { id } = req.params;
    const { user } = req;

    debug("Categoriass", category)

    let newVacant = await Vacant.findById(id);

    if (!newVacant) {
      newVacant = new Vacant();
      newVacant["company"] = user._id;
    } else {
      if (newVacant["company"].toString() !== user._id.toString()) {
        return res.status(403).json({ error: "Unauthorized" });
      }
    }

    newVacant["name"] = name;
    newVacant["description"] = description;
    newVacant["salary"] = salary;
    newVacant["image"] = image;
    newVacant["esPasantia"] = esPasantia;
    newVacant["category"] = category;
    newVacant["competences"] = competences;
    newVacant["caracteristics"] = caracteristics;

    const vacantSaved = await newVacant.save();
    if (!vacantSaved) {
      return res.status(400).json({ error: "Error creating vacant" });
    }

    return res.status(201).json({ vacantSaved });
  } catch (error) {
    next(error);
  }
};

// controller.findAll = async (req, res, next) => {
//   try {
//     const vacants = await Vacant.find({ hidden: false })
//       .populate("company", "companyName email")
//       .populate("nominatedUsers", "username email");

//     return res.status(200).json({ vacants });
//   } catch (error) {
//     next(error);
//   }
// };

controller.findAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    debug("Page", page);
    debug("Limit", limit);
    debug("Skip", skip);

    const vacants = await Vacant.find({ hidden: false })
      .populate("company", "companyName email")
      .select("-nominatedUsers")
      .skip(skip)
      .limit(limit);

    const total = await Vacant.countDocuments({ hidden: false });

    return res.status(200).json({
      total,
      pages: Math.ceil(total / limit),
      vacants
    });
  } catch (error) {
    next(error);
  }
};


//Funcion para buscar vacantes que no se sean pasantian
controller.findJustWork = async (req, res, next) => {
  try {
    const vacants = await Vacant.find({ hidden: false, esPasantia: false })
      .populate("company", "companyName email")
      // .populate("nominatedUsers", "username email");
      .select("-nominatedUsers")
      .sort({ createdAt: -1 });

    return res.status(200).json({ vacants });
  } catch (error) {
    next(error);
  }
};

//Funcion para buscar vacantes que sean pasantias
controller.findJustInternship = async (req, res, next) => {
  try {
    const vacants = await Vacant.find({ hidden: false, esPasantia: true })
      .populate("company", "companyName email")
      // .populate("nominatedUsers", "username email");
      .select("-nominatedUsers")
      .sort({ createdAt: -1 });

    return res.status(200).json({ vacants });
  } catch (error) {
    next(error);
  }
};

controller.findOneById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vacant = await Vacant.findOne({ _id: id, hidden: false })
      .populate("company", "companyName email")
      .populate("nominatedUsers", "username email");

    if (!vacant) {
      return res.status(404).json({ error: "Vacant not found" });
    }

    return res.status(200).json({ vacant });
  } catch (error) {
    next(error);
  }
};

// controller.findWorkByCategory = async (req, res, next) => {
//   try {
//     //Por URL viene category
//     const { category } = req.params;

//     const vacants = await Vacant.find({ esPasantia:false, category: category, hidden: false })

//     return res.status(200).json({ vacants });

//   } catch (error) {
//     next(error);
//   }
// }
controller.findWorkByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const vacants = await Vacant.find({ esPasantia:false, category: category, hidden: false })
      .skip(skip)
      .limit(limit);

    const total = await Vacant.countDocuments({ esPasantia:false, category: category, hidden: false });

    return res.status(200).json({
      total,
      pages: Math.ceil(total / limit),
      vacants
    });

  } catch (error) {
    next(error);
  }
}


// controller.findIntershipByCategory = async (req, res, next) => {
//   try {
//     //Por URL viene category
//     const { category } = req.params;

//     const vacants = await Vacant.find({ esPasantia:true, category: category, hidden: false })

//     return res.status(200).json({ vacants });

//   } catch (error) {
//     next(error);
//   }
// }
controller.findIntershipByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const vacants = await Vacant.find({ esPasantia:true, category: category, hidden: false })
      .skip(skip)
      .limit(limit);

    const total = await Vacant.countDocuments({ esPasantia:true, category: category, hidden: false });

    return res.status(200).json({
      total,
      pages: Math.ceil(total / limit),
      vacants
    });

  } catch (error) {
    next(error);
  }
}


controller.findByUserId = async (req, res, next) => {
  try {
    const { id } = req.params;

    const vacants = await Vacant.find({ company: id, hidden: false })
      .populate("company", "companyName email")
      .populate("nominatedUsers", "username email");

    return res.status(200).json({ vacants });
  } catch (error) {
    next(error);
  }
};

controller.findOwn = async (req, res, next) => {
  try {
    const { _id } = req.user;

    const vacants = await Vacant.find({ company: _id })
      .populate("company", "companyName email")
      .populate("nominatedUsers", "username email");

    return res.status(200).json({ vacants });
  } catch (error) {
    next(error);
  }
};

controller.findSavedVacants = async (req, res, next) => {
  try {
    const user = await req.user.populate({
      path: "savedVacants",
      populate: [
        { path: "company", select: "companyName email" },
        { path: "nominatedUsers", select: "username email" }, //Es nesecario enviarlo? Si no es, como se quita?
      ],
    });

    return res.status(200).json({ vacants: user["savedVacants"] });
  } catch (error) {
    next(error);
  }
};

controller.deleteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user } = req;

    const vacant = await Vacant.findOneAndDelete({
      _id: id,
      company: user._id,
    });

    if (!vacant) {
      return res.status(404).json({ error: "Vacant not found" });
    }

    return res.status(200).json({ message: "Vacant deleted" });
  } catch (error) {
    next(error);
  }
};

controller.toggleHidden = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user } = req;

    const vacant = await Vacant.findOne({ _id: id, company: user._id })
      // .populate("company", "companyName email")
      .populate("nominatedUsers", "username email");

    if (!vacant) {
      return res.status(404).json({ error: "Vacant not found" });
    }

    vacant["hidden"] = !vacant["hidden"];

    const vacantSaved = await vacant.save();

    return res.status(200).json({ vacant: vacantSaved });
  } catch (error) {
    next(error);
  }
};

controller.applyVacant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user } = req;

    const vacant = await Vacant.findOne({ _id: id, hidden: false }).populate(
      "company",
      "companyName email"
    );

    if (!vacant) {
      return res.status(404).json({ error: "Vacant not found" });
    }

    //Aplicar o desaplicar a la vacante
    let _nominatedUsers = vacant["nominatedUsers"] || [];

    const alredyApplied =
      _nominatedUsers.findIndex((_i) => _i.equals(user._id)) >= 0;

    if (alredyApplied) {
      _nominatedUsers = _nominatedUsers.filter((_i) => !_i.equals(user._id));
    } else {
      _nominatedUsers = [user._id, ..._nominatedUsers];
    }

    vacant["nominatedUsers"] = _nominatedUsers;

    const vacantSaved = await (
      await vacant.save()
    ).populate("nominatedUsers", "username email");

    return res.status(200).json({ vacant: vacantSaved });
  } catch (error) {
    next(error);
  }
};

controller.saveVacant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user } = req;

    const vacant = await Vacant.findOne({ _id: id, hidden: false })
      .populate("company", "companyName email")
      .populate("nominatedUsers", "username email");

    if (!vacant) {
      return res.status(404).json({ error: "Vacant not found" });
    }

    //Guardar o borrar de la coleccion de savedVacants
    let _savedVacants = user["savedVacants"] || [];

    const alredySaved =
      _savedVacants.findIndex((_i) => _i.equals(vacant._id)) >= 0;

    if (alredySaved) {
      _savedVacants = _savedVacants.filter((_i) => !_i.equals(vacant._id));
    } else {
      _savedVacants = [vacant._id, ..._savedVacants];
    }

    user["savedVacants"] = _savedVacants;

    const userSaved = await (
      await user.save()
    ).populate({
      path: "savedVacants",
      populate: [
        { path: "company", select: "companyName email" },
        { path: "nominatedUsers", select: "username email" },
      ],
    });

    return res.status(200).json({ vacants: userSaved["savedVacants"] });
  } catch (error) {
    next(error);
  }
};

module.exports = controller;
