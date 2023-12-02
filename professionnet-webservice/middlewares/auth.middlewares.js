const debug = require("debug")("app:auth-middlewares");
const { verifyToken } = require("../utils/jwt.tools");
const User = require("../models/User.model");
const Company = require("../models/Company.model");

const ROLES = require("../data/roles.constants.json");

const middleware = {};
const PREFIX = "Bearer";

middleware.authentication = async (req, res, next) => {
  try {
    //Verificar el Authorization
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    //Token -> Bearer djsjkdh981hdjkadbsznxjksd
    const [prefix, token] = authorization.split(" ");

    if (prefix !== PREFIX) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    //Verificar que el token sea valido
    if (!token) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const _Id = payload.sub;

    //Verificar que el usuario o empresa exista
    const user = await User.findById(_Id);
    const company = await Company.findById(_Id);

    if (user) {

      //Comparar el token con los tokens de la base de datos
      const isTokenValid = user.tokens.includes(token);
      if (!isTokenValid) {
        return res.status(401).json({ error: "User not authenticated" });
      }
     
      //Modificar la res, para anadir la informacion del usuario
      req.user = user;
      req.token = token;

    } else if (company) {

      //Comparar el token con los tokens de la base de datos
      const isTokenValid = company.tokens.includes(token);
      if (!isTokenValid) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      //Modificar la res, para anadir la informacion del usuario
      req.user = company;
      req.token = token;

    } else if (!user && !company) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};




middleware.authorization = (roleRequired = ROLES.SYSADMIN) => {
  
  return (req, res, next) => {
    try {
      const { roles = [] } = req.user;
  
      //Verificar que el rol exista
      const isAuth = roles.includes(roleRequired);
      const isSysAdmin = roles.includes(ROLES.SYSADMIN);

      //Verificar que el rol sea el requerido
      if (!isAuth && !isSysAdmin) {
        return res.status(403).json({ error: "Forbbiden" });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
};

module.exports = middleware;
