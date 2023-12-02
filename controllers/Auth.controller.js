const User = require("../models/User.model");
const Company = require("../models/Company.model");
const { createToken, verifyToken } = require("../utils/jwt.tools");
const ROLES = require("../data/roles.constants.json");

const debug = require("debug")("app:auth-controller");

const controller = {};

controller.registerUser = async (req, res, next) => {
  try {
    //Obtener la informacion del usuario
    const {
      firstName,
      lastName,
      email,
      password,
      department,
      municipality,
      telephone,
      birthDate,
      gender,
    } = req.body;

    //Verificar si el usuario y usuario ya existe
    const user = await User.findOne({
      $or: [{ email: email }],
    });
    if (user) return res.status(409).json({ error: "Email already used" });

    const authTelephone = await User.findOne({
      $or: [{ telephone: telephone }],
    });
    if (authTelephone)
      return res.status(409).json({ error: "Telephone already used" });

    //Crear el usuario si no existe
    const newUser = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      department: department,
      municipality: municipality,
      telephone: telephone,
      birthDate: birthDate,
      roles: [ROLES.USER],
      gender: gender,
    });

    await newUser.save();

    return res.status(201).json({ message: "User created :D" });
  } catch (error) {
    next(error);
  }
};


controller.editUserTestimony = async (req, res, next) => {
  try {
    const { testimony } = req.body;
    const { id } = req.params;
    const { user } = req;

    let updateUserProfile = await User.findById(id);

    if (!updateUserProfile) {
      return res.status(404).json({ error: "User not found" });
    }
    if (updateUserProfile._id.toString() !== user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    updateUserProfile.testimony = testimony;

    const updatedProfile = await updateUserProfile.save();
    const selectedProfile = await User.findById(updatedProfile._id).select(
      "-tokens -salt"
    );
    if (!updatedProfile) {
      return res.status(400).json({ error: "Error updating user" });
    }

    return res.status(201).json({ selectedProfile });

  } catch (error) {
    next(error);
  }
}


controller.editUserProfile = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      password,
      department,
      municipality,
      telephone,
      birthDate,
      gender,
      category,
      habilities,
      competences,
      caracteristics,
      experience,
      education
    } = req.body;
    const { id } = req.params;
    const { user } = req;

    let updateUserProfile = await User.findById(id);

    if (!updateUserProfile) {
      return res.status(404).json({ error: "User not found" });
    }
    if (updateUserProfile._id.toString() !== user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    updateUserProfile.firstName = firstName;
    updateUserProfile.lastName = lastName;
    updateUserProfile.password = password;
    updateUserProfile.department = department;
    updateUserProfile.municipality = municipality;
    updateUserProfile.telephone = telephone;
    updateUserProfile.birthDate = birthDate;
    updateUserProfile.gender = gender;
    updateUserProfile.category = category;
    updateUserProfile.habilities = habilities;
    updateUserProfile.competences = competences;
    updateUserProfile.caracteristics = caracteristics;
    updateUserProfile.experience = experience;
    updateUserProfile.education = education;


    const updatedProfile = await updateUserProfile.save();
    const selectedProfile = await User.findById(updatedProfile._id).select(
      "-tokens -salt"
    );
    if (!updatedProfile) {
      return res.status(400).json({ error: "Error updating user" });
    }

    return res.status(201).json({ selectedProfile });
  } catch (error) {
    next(error);
  }
};

controller.registerCompany = async (req, res, next) => {
  try {
    //Obtener la informacion del usuario
    // companyName, email, ruc, telephone, address, password, roles
    const {
      companyName,
      email,
      ruc,
      telephone,
      department,
      municipality,
      password,
    } = req.body;

    //Verificar si el usuario y usuario ya existe
    const company = await Company.findOne({
      $or: [{ companyName: companyName }, { email: email }],
    });
    if (company)
      return res.status(409).json({ error: "Company already exists" });

    const authTelephone = await Company.findOne({
      $or: [{ telephone: telephone }],
    });
    if (authTelephone)
      return res.status(409).json({ error: "Telephone already used" });

    const authRuc = await Company.findOne({
      $or: [{ ruc: ruc }],
    });
    if (authRuc) {
      return res.status(409).json({ error: "RUC already used" });
    }

    //Crear el usuario si no existe
    const newCompany = new Company({
      companyName: companyName,
      email: email,
      ruc: ruc,
      telephone: telephone,
      department: department,
      municipality: municipality,
      password: password,
      roles: [ROLES.COMPANY],
    });

    await newCompany.save();

    return res.status(201).json({ message: "Company created :D" });
  } catch (error) {
    next(error);
  }
};

controller.editCompanyProfile = async (req, res, next) => {
  try {

    const {
      companyName,
      email,
      telephone,
      department,
      municipality
    } = req.body;
    const { id } = req.params;
    const { user } = req;

    let updateCompanyProfile = await Company.findById(id);

    if (!updateCompanyProfile) {
      return res.status(404).json({ error: "Company not found" });
    }

    if (updateCompanyProfile._id.toString() !== user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    updateCompanyProfile.companyName = companyName;
    updateCompanyProfile.email = email;
    updateCompanyProfile.telephone = telephone;
    updateCompanyProfile.department = department;
    updateCompanyProfile.municipality = municipality;

    const updatedProfile = await updateCompanyProfile.save();
    const selectedProfile = await Company.findById(updatedProfile._id).select(
      "-tokens -salt -hashedPassword"
    );
    if (!updatedProfile) {
      return res.status(400).json({ error: "Error updating company" });
    }

    return res.status(201).json({ selectedProfile });
  } catch (error) {
    next(error);
  }
};


controller.login = async (req, res, next) => {
  try {
    //Obtener la informacion del usuario -> identificador (username o email) y password
    const { identifier, password } = req.body;

    //Verificar si el usuario o empresa existe
    const user = await User.findOne({
      $or: [{ email: identifier }],
    });

    const company = await Company.findOne({
      $or: [{ email: identifier }],
    });

    //Si no existe, retornar un error
    if (!user && !company)
      return res.status(404).json({ error: "User not found" });

    let token = null;

    //Si existe, verificar si la contraseña es correcta
    //Si la contraseña es incorrecta, retornar un error 401
    if (user) {
      if (!user.comparePassword(password)) {
        return res.status(401).json({ error: "Incorrect password" });
      }

      //Crear un token para el usuario
      token = await createToken(user._id);

      //Almacenar el token en la base de datos
      //Verificar la integridad de los tokens actuales - Max 5 sesiones
      let _tokens = [...user.tokens];
      const _verifyPromises = _tokens.map(async (token) => {
        const status = await verifyToken(token);

        return status ? token : null;
      });

      _tokens = (await Promise.all(_verifyPromises))
        .filter((_t) => _t)
        .slice(0, 4);

      _tokens = [token, ..._tokens];
      user.tokens = _tokens;

      await user.save();
    } else if (company) {
      if (!company.comparePassword(password)) {
        return res.status(401).json({ error: "Incorrect password" });
      }

      //Crear un token para el usuario
      token = await createToken(company._id);

      //Almacenar el token en la base de datos
      //Verificar la integridad de los tokens actuales - Max 5 sesiones
      let _tokens = [...company.tokens];
      const _verifyPromises = _tokens.map(async (token) => {
        const status = await verifyToken(token);

        return status ? token : null;
      });

      _tokens = (await Promise.all(_verifyPromises))
        .filter((_t) => _t)
        .slice(0, 4);

      _tokens = [token, ..._tokens];
      company.tokens = _tokens;

      await company.save();
    }

    //Devolver el token
    return res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

controller.whoAmI = async (req, res, next) => {
  try {
    const { _id, companyName, savedVacants, firstName, lastName, department, email, birthDate, gender, roles, education, experience, competences, habilities, caracteristics } = req.user;

    return res
      .status(200)
      .json({ _id, companyName, firstName, lastName, email, savedVacants, department, roles, birthDate, gender, education, experience, competences, habilities, caracteristics });
  } catch (error) {
    next(error);
  }
};

module.exports = controller;
