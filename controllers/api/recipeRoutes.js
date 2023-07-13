
const router = require('express').Router();

const {
    Recipe,
    SelectedRecipe,
    Ingredients,
    ShoppingList
} = require('../../models');

const withAuth = require('../../utils/auth');


//i need to get all of the recipes
router.get("/", (req, res) => {
    Recipe.findAll({
            attributes: ["", "", "" ],
            order: [
                ["created_at", "DESC"]
            ],
            include: [{
                    model: User,
                    attributes: ["username"],
                },
                {
                    model: SelectedRecipe,
                    attributes: ["id", "is_favorite", "recipe_id", "user_id"],
                    include: {
                        model: User,
                        attributes: ["username"],
                    },
                },
            ],
        })
        .then((BlogpostData) => res.json(BlogpostData))
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});
//then i need to get a single recipe
router.get("/:id", (req, res) => {
    Recipe.findOne({
            where: {
                id: req.params.id,
            },
            attributes: ["id", "content", "title", "created_at"],
            include: [{
                    model: User,
                    attributes: ["username"],
                },
                {
                    model: Comment,
                    attributes: ["id", "is_favorite", "recipe_id", "user_id"]],
                    include: {
                        model: User,
                        attributes: ["username"],
                    },
                },
            ],
        })
        .then((RecipeData) => {
            if (!RecipeData) {
                res.status(404).json({
                    message: "Not found"
                });
                return;
            }
            res.json(RecipeData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

//the need to delete the recipe
router.delete("/:id", withAuth, (req, res) => {
    Recipe.destroy({
            where: {
                id: req.params.id,
            },
        })
        .then((RecipeData) => {
            if (!RecipeData) {
                res.status(404).json({
                    message: "Not found!"
                });
                return;
            }
            res.json(RecipeData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;




// Define your recipe routes
// router.get('/', async (req, res) => {
//   try {
//     const apiKey = 'YOUR_API_KEY';
//     const query = 'your-query'; // Replace with the desired query

//     // Make a request to the API
//     const response = await axios.get(`https://api.edamam.com/search?q=${query}&app_id=${apiKey}`);

//     // Extract the recipes from the API response
//     const recipes = response.data.hits.map(hit => hit.recipe);

//     // Render the recipes using Handlebars template
//     res.render('recipes', { recipes });
//   } catch (error) {
//     // Handle any errors that occur
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Add more recipe routes as needed

// module.exports = router;