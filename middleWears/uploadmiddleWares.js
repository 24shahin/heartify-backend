const fs = require("fs");

const removeFile = (path) => {
    fs.unlink(path, (err) => {
      if (err) throw err;
    });
  };

module.exports = async (req, res, next) => {
  try {
    if (!req.files || Object.values(req.files).flat().length === 0) {
      return res.status(404).json({ message: "No File Selected" });
    }
    const file = Object.values(req.files).flat();
    file.forEach((files) => {
      if (
        files.mimetype !== "image/png" &&
        files.mimetype !== "image/jpeg" &&
        files.mimetype !== "image/webp" &&
        files.mimetype !== "image/gif"
      ) {
        removeFile(files.tempFilePath);
        return res.status(404).json({ message: "Unsupported File" });
      }
      if(files.size > 1024*1024*5){
        removeFile(files.tempFilePath);
        return res.status(404).json({ message: "File size too large"});
      }
    });
    
    next()
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};


