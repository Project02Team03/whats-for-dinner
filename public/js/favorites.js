//nav-bar rendering saved recipes
const getSavedRecipes=async(event) => {
    event.preventDefault();
    const id=document.getElementById('saved-recipes').getAttribute('data-user');
    const response= await fetch (`api/users/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json'}
    });
    if (response.ok) {
      document.location.replace('/');
     
    } else {
      alert('Failed to log in');
    }
  };
  
  document.getElementById('saved-recipes').addEventListener('click', getSavedRecipes);
