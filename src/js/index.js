import Search from './models/Search';
import Recipe from './models/Recipe';
import  { elements, renderLoader, clearLoader }  from './views/elementsDom';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';

/** Global State of the app*/
const state = {};

const controlSearch = async () => {
  const query = searchView.getInput();
  
  if(query){
    state.search = new Search(query);

    searchView.clearInput();
    searchView.clearResults();
    
    renderLoader(elements.searchRes);
    
    try {
      await state.search.getResults();
      
      clearLoader();
      
      searchView.renderResults(state.search.result)
    }
    catch (err) {
      clearLoader();
      alert('Error on search')
      console.log(err);
    }
  }
}

elements.searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  controlSearch();
})

elements.searchResPages.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-inline');

  if(btn) {
    const gotoPage = Number(btn.dataset.goto);

    searchView.clearResults();
    searchView.clearPrintedBtn();

    searchView.renderResults(state.search.result, gotoPage);
  }
  
});

const controlRecipe = async () => {
  const id = window.location.hash.replace('#', '');
  
  if(id) {
    renderLoader(elements.recipe);

    state.recipe = new Recipe(id);

    try {
      recipeView.clearRecipe();

      await state.recipe.getRecipe();
      
      state.recipe.parseIngredients();
      state.recipe.calcTime();
      state.recipe.calcServings();

      clearLoader();

      recipeView.renderRecipe(state.recipe);
    } 
    catch (err) {
      alert('Error on recipe')
      console.log(err)
    }
  }
}

['hashchange', 'load'].forEach((event) => window.addEventListener(event, controlRecipe));