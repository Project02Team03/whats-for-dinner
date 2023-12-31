
const router = require('express').Router();

const { Recipe, 
    SelectedRecipe,
    Ingredients, 
    ShoppingList, 
    User } = require('../../models');

const withAuth = require('../../utils/auth');

router.post('/list', withAuth, async (req, res) => {
  try {
    if (req.session) {
      const { ingredient_img, ingredient_name, amount, units, recipeId } = req.body;
      const needIt = await Ingredients.create({
        ingredient_img: ingredient_img,
        ingredient_name: ingredient_name,
        amount: amount,
        units: units,
        in_list: true,
      });

      await Recipe.findByPk(recipeId).then((recipe) => {
        if (recipe) {
          recipe.addIngredient(needIt);
        }
      });
      console.log(needIt);
      res.json(needIt);
    }
  } catch (err) {
    res.status(500).json(err);
  }
})

//get all ingredients
router.get("/", (req, res) => {
   //console.log('HI THERE');
   
    Ingredients.findAll({
            attributes: ["id", "ingredient_name", "amount", "in_stock"],
            include: [{ model: Recipe, through: ShoppingList , as: 'recipes'}],
            })
        .then((IngredientsData) => res.json(IngredientsData))
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

/* Pulls ingredients for a single recipe */
router.get('/:id', withAuth, async (req, res) => {
  try {
    if (req.session) {
    const recipeId = req.params.id;

    const recipeData = await Recipe.findByPk(recipeId, {
      include: {
        model: Ingredients,
        through: { attributes: [] },
        as: 'ingredientList',
      },
    });

    if (!recipeData) {
      return res.status(404).json({ message: 'Recipe not found.' });
    }

    const ingredients = recipeData.ingredientList;

    console.log(ingredients.map((ingredient) => ingredient.in_list));

    res.status(200).json(ingredients);
    };
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Can\'t find those ingredients' });
  }
});

//update ingredient by its id , ex: in_stock: true
router.put('/:id', async(req,res) =>{
  //console.log('---------LETS UPDATE-------------------');
  try{
    const ingredientData=await Ingredients.update(
      req.body, {
        where: {
          id: req.params.id,
        },
      });
      if (ingredientData){
        res.status(200).json(ingredientData);
      }else {
        res.status(404).json.end();
      }
  } catch (err){
    res.status(500).json(err);
  }
}); 





//get all ingredients from one recipe?  ---> in recipe-routes, get recipe(with ingredients) by id
// router.get("/recipe/:id", (req, res) => {
//     const { id } = req.params;
//     Ingredients.findByPk({ where: { id } })
//       .then((ingredientsData) => {
//         if (ingredientsData.length === 0) {
//           res.status(404).json({ message: `No ingredients found` });
//           return;
//         }
//         res.status(200).json(ingredientsData);
//       })
//       .catch((err) => {
//         res.status(500).json(err);
//       });
//   });
  
  module.exports = router;