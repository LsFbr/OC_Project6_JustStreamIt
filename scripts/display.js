document.addEventListener('DOMContentLoaded',displayBestMovie);
document.addEventListener('DOMContentLoaded',displayCategory1Movies);

async function displayBestMovie() {
    const movie = await fetchBestMovie();
    if (!movie) return;

    const imgElement = document.querySelector('#meilleur-film-content img');
    imgElement.src = movie.image_url;
    imgElement.alt = `Affiche du film ${movie.title}`;
    
    document.querySelector('#meilleur-film-description h3').textContent = movie.title;
    document.querySelector('#meilleur-film-description p').textContent = movie.description;
}

async function displayCategory1Movies() {
    const movies = await fetchCategoryMovies(CATEGORY_1);
    console.log(movies);
}
