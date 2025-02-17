exports.preventBlockedInteractions = async (req, res, next) => {
    const user = await userModel.findById(req.user.id);
    if (user.blockedUsers.includes(req.params.id)) {
      return res.status(403).json({ message: "You cannot interact with this user" });
    }
    next();
  };