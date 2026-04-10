const jwt = require("jsonwebtoken");
const secret_token = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized", details: "Missing token" });
    }

    jwt.verify(token, secret_token, (err, decodedToken) => {
      if (err) {
        return res
          .status(401)
          .json({ error: "Unauthorized", details: "Invalid token" });
      }
      req.user = decodedToken;
      next();
    });
  } catch (error) {
    res.status(401).json({ error });
  }
};
