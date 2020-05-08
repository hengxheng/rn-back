import passport from "passport";
import Models from "../../../models";
import multer from "multer";

const Recipe = Models.Recipe;
const Tag = Models.Tag;
const Recipe_Tag = Models.Recipe_Tag;
const RecipeImage = Models.RecipeImage;

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

        upload(req, res, async function (err) {
          if (err) {
            return res.status(500).json(err);
          } else {
            try {
              let recipe = null;

              if (req.body.id) {
                recipe = await Recipe.findOne({
                  where: { id: req.body.id },
                });
                if (recipe) {
                  recipe.title = req.body.title;
                  recipe.content = req.body.content;
                  await recipe.save();
                }
              } else {
                recipe = await Recipe.create({
                  user_id: user.id,
                  hashCode: (req.body.title + " " + user.id)
                    .toLowerCase()
                    .replace(/[^\w ]+/g, "")
                    .replace(/ +/g, "-"),
                  title: req.body.title,
                  content: req.body.content,
                });
              }

              //update tags
              if (req.body.tags) {
                const tags = JSON.parse(req.body.tags);

                //async map function to get ids
                const getTagIds = async () => {
                  return Promise.all(tags.map(async (tag) => {
                    let tagName = tag.toLowerCase();
                    const tagObj = await Tag.findOne({
                      where: { name: tagName },
                    });
  
                    if(tagObj){
                      return tagObj.id;
                    }
                    else{
                      const _tag = await Tag.create({
                        name: tagName,
                        slug: tagName.replace(/[^\w ]+/g, "").replace(/ +/g, "-"),
                      });
                      return _tag.id;
                    }
                  }));
                }
                let tagIds = await getTagIds();

                if (tagIds) {
                  Recipe_Tag.destroy({
                    where: {
                      r_id: recipe.id,
                    },
                  }).then(async () => {
                    const recipeTag = [];
                    tagIds.map((tag_id) => {
                      recipeTag.push({
                        r_id: recipe.id,
                        tag_id: tag_id,
                      });
                    });

                    await Recipe_Tag.bulkCreate(recipeTag);
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

                await RecipeImage.destroy({
                  where: { r_id: recipe.id },
                }).then(() => {
                  RecipeImage.bulkCreate(images);
                });
              }

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
