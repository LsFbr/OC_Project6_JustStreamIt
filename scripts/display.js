document.addEventListener('DOMContentLoaded',displayBestMovie);
document.addEventListener('DOMContentLoaded',displayCategoryMovies);

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
    if (!movies) return;

    for (let i = 0; i < movies.length; i++) {
        const movie = movies[i];
        const imgElement = document.querySelector(`#cat-1-${i + 1} img`);
        imgElement.src = movie.image_url;
        imgElement.alt = `Affiche du film ${movie.title}`;

        document.querySelector(`#cat-1-${i + 1} h3`).textContent = movie.title;
    }
}

async function displayCategory2Movies() {
    const movies = await fetchCategoryMovies(CATEGORY_2);
    if (!movies) return;

    for (let i = 0; i < movies.length; i++) {
        const movie = movies[i];
        const imgElement = document.querySelector(`#cat-2-${i + 1} img`);
        imgElement.src = movie.image_url;
        imgElement.alt = `Affiche du film ${movie.title}`;

        document.querySelector(`#cat-2-${i + 1} h3`).textContent = movie.title;
    }
}

async function displayCategory3Movies() {
    const movies = await fetchCategoryMovies(CATEGORY_3);
    if (!movies) return;

    for (let i = 0; i < movies.length; i++) {
        const movie = movies[i];
        const imgElement = document.querySelector(`#cat-3-${i + 1} img`);
        imgElement.src = movie.image_url;
        imgElement.alt = `Affiche du film ${movie.title}`;

        document.querySelector(`#cat-3-${i + 1} h3`).textContent = movie.title;
    }
}

async function displayCategoryMovies() {
    await displayCategory1Movies();
    await displayCategory2Movies();
    await displayCategory3Movies();
}