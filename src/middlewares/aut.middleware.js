export const authMiddleware = (req, res, next) => {
    const { age } = req.body;
    if (age < 18) {
      return res.status().json({ message: "No alcanzaste la mayoria de edad" });
    }
    next();
  };