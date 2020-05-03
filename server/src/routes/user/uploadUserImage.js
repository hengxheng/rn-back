import passport from "passport";
import multer from "multer";
import Models from "../../../models";

const User = Models.User;
module.exports = (app) => {
  
  const filePath = "uploads/profiles";
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/" + filePath);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });

  const upload = multer({ storage: storage });

  app.post("/user/upload_avatar/:userId", upload.single("avatar"), function (
    req,
    res
  ) {
    User.findOne({
      where: {
        id: req.params.userId,
      },
    }).then((userInfo) => {
      const _filePath = filePath + "/" + req.file.originalname;
      if (userInfo != null) {
        userInfo.update({ image: _filePath }).then(() => {
          return res
            .status(200)
            .send({ filePath: _filePath, message: "Your image is updated." });
        });
      } else {
        res
          .status(401)
          .send({
            auth: true,
            user: null,
            message: "Your account does not exists.",
          });
      }
    });
  });
  // app.post("/user/upload_avatar/:userId", (req, res, next) => {
  //   passport.authenticate("jwt", { session: false }, (err, user, info) => {
  //     const storage = multer.diskStorage({
  //       destination: function (req, file, cb) {
  //         const path = require("path");
  //         const filePath = `/uploads/profiles/${req.params.userId}`;
  //         cb(null, path.join(__dirname, "../../public/" + filePath));
  //       },
  //     });

  //     const upload = multer({ storage: storage }).single("file");
  //     upload(req, res, function (err) {
  //       console.log('dfdf');
  //       console.log(req.file);
  //       if (err) {
  //         return res.status(500).json(err);
  //       } else {
  //         return res.status(200).send({ fileName: req.file.filename });
  //       }
  //     });
  //   })(req, res, next);
  // });
};
