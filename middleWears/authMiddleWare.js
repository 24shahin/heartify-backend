const jwt = require("jsonwebtoken");
exports.authMiddleWare = (req, res, next) => {
  try {
    const tempToken = req.header("Authorization");
    
    let token = tempToken ? tempToken.slice(7, tempToken.length) : "";

    if (!token) {
      return res.status(400).json({ message: "User not Valid" });
    }
    jwt.verify(token, process.env.SECRET_TOKEN, (err, user) => {
      if (err) {
        return res.status(400).json({ message: "Invalid Authorization" });
      }
      req.user = user;
      
      next();
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
