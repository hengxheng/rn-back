import passport from "passport";
import Models from "../../../models";
import multer from "multer";

const Recipe = Models.Recipe;
const Tag = Models.Tag;
const Recipe_Tag = Models.Recipe_Tag;
const Image = Models.Image;
const Recipe_Image = Models.Recipe_Img;

module.exports = (app) => {
  app.post("/recipe/add", (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      if (err) {
        console.error(err);
      }

      if (info !== undefined) {
        console.error(info.message);
        res.status(403).send(info.message);
      } else {
        //logined
        const filePath = "uploads/productImages";
        const storage = multer.diskStorage({
          destination: function (req, file, cb) {
            cb(null, "public/" + filePath);
          },
          filename: function (req, file, cb) {
            cb(null, file.originalname);
          },
        });

        const upload = multer({ storage: storage }).array("images", 10);

        upload(req, res, function (err) {
          if (err) {
            return res.status(500).json(err);
          } else {
            const data = {
              user_id: user.id,
              hashCode: (req.body.title + " " + user.id)
                .toLowerCase()
                .replace(/[^\w ]+/g, "")
                .replace(/ +/g, "-"),
              title: req.body.title,
              content: req.body.content,
            };

            try {
              Recipe.create(data).then(async (recipe) => {
                //update tags
                if (req.body.tags) {
                  const tags = JSON.parse(req.body.tags);
                  let tagIds = [];
                  await tags.map(async (tag) => {
                    let tagName = tag.toLowerCase();
                    const tagObj = await Tag.findOne({
                      where: { name: tagName },
                    });
                    let _tag = null;
                    if (!tagObj) {
                      _tag = await Tag.create({
                        name: tagName,
                        slug: tagName
                          .replace(/[^\w ]+/g, "")
                          .replace(/ +/g, "-"),
                      });
                    } else {
                      _tag = tagObj;
                    }

                    tagIds.push(_tag.id);
                  });

                  if (tagIds) {
                    await Recipe_Tag.destroy({
                      where: {
                        r_id: recipe.id,
                      },
                    }).then(() => {
                      const recipeTag = [];
                      tagIds.map((tag_id) => {
                        recipeTag.push({
                          r_id: recipe.id,
                          tag_id: tag_id,
                        });
                      });

                      Recipe_Tag.bulkCreate(recipeTag);
                    });
                  }
                }

                //upload images
                if (req.files) {
                  const images = [];
                  req.files.map((file) => {
                    images.push({
                      r_id: recipe.id,
                      user_id: user.id,
                      path: file.path.replace("public/", ""),
                    });
                  });

                  Image.bulkCreate(images).then(async (imgs) => {
                    const recipeImage = [];
                    imgs.map((i) => {
                      recipeImage.push({
                        r_id: recipe.id,
                        img_id: i.id,
                      });
                    });
                    await Recipe_Image.destroy({
                      where: { r_id: recipe.id },
                    }).then(() => {
                      Recipe_Image.bulkCreate(recipeImage);
                    });
                  });
                }
              });

              res.status(200).send({
                auth: true,
                message: "Recipe is created",
                data: recipe,
              });
            } catch (e) {
              console.log(e);
              res.status(500).send({
                error: true,
                message: e,
              });
            }
          }
        });
      }
    })(req, res, next);
  });
};
