const cloudinary = require("cloudinary");
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});


// upload Cloudinary Function
const upLoadCloudinaty = async (file, path) => {
  return new Promise((resolve) => {
    cloudinary.v2.uploader.upload(
      file.tempFilePath,
      {
        folder: path,
      },
      (err, res) => {
        if (err) {
          removeFile(file.tempFilePath);
          return res.status(404).json({ message: "File Upload Filed" });
        }
        resolve({
          url: res.secure_url,
        });
      }
    );
  });
};
//   file remove function
const removeFile = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};



exports.upolads = async (req, res) => {
  try {
    const { path } = req.body;
    const files = Object.values(req.files).flat();
    const images = [];
    for (const file of files) {
      const url = await upLoadCloudinaty(file, path);
      images.push(url);
      removeFile(file.tempFilePath);
    }
    res.status(200).json(images)
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

exports.imagesList = async (req, res)=>{
try {
  const {path,sort,max} = req.body;
  cloudinary.v2.search
  .expression(`${path}`)
  .sort_by('public_id',`${sort}`)
  .max_results(max)
  .execute()
  .then((result) => {
    res.status(200).json(result);
  })
  
} catch (error) {
  return res.status(404).json({ message: error.message });
}
}