const renderModal = async (event) => {
    event.preventDefault();

    const id = event.target.getAttribute("data-recipe");
    console.log("THIS IS THE RECIPE ID", id);

    try {
        const response = await fetch(`/api/recipes/${id}`);

        console.log(response);

        if (response.ok) {
            const recipe = await response.json();
            const template = Handlebars.compile(document.getElementById('recipe-modal').innerHTML);
            const renderedHTML = template(recipe);
            document.getElementById('recipeModalContent').innerHTML = renderedHTML;
        } else {
            alert(response.statusText);
        }
    } catch (err) {
        console.error(err);
    }
};

document.querySelector("#openModal").addEventListener("click", renderModal);
