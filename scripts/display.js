document.addEventListener('DOMContentLoaded',displayBestMovie);
document.addEventListener('DOMContentLoaded',displayCategoryMovies);
document.addEventListener('DOMContentLoaded',displayCustomCategoryChoices);
document.addEventListener('DOMContentLoaded',setupShowMoreButtons);
document.addEventListener('DOMContentLoaded',displayCategoryTitles);

const selectElement = document.getElementById('cat-custom-select');
selectElement.addEventListener('change', displayCustomCategoryMovies);

function setupShowMoreButtons() {
    const categoryIdentifiers = ['cat-1', 'cat-2', 'cat-3', 'cat-custom'];
    for (let i = 0; i < categoryIdentifiers.length; i++) {
        const buttonElement = document.getElementById(`${categoryIdentifiers[i]}-show-more`);
        if (!buttonElement) return;

        const hiddenMovies = document.querySelectorAll(`#${categoryIdentifiers[i]}-grid .hidden`);

        buttonElement.addEventListener('click', () => {
            
            if (buttonElement.textContent === 'Voir plus') {
                for (let j = 0; j < hiddenMovies.length; j++) {
                    hiddenMovies[j].classList.remove('hidden');
                    hiddenMovies[j].classList.add('block');
                }
                buttonElement.textContent = 'Voir moins';
            } else {
                for (let j = 0; j < hiddenMovies.length; j++) {
                    hiddenMovies[j].classList.remove('block');
                    hiddenMovies[j].classList.add('hidden');
                }
                buttonElement.textContent = 'Voir plus';
            }
        });
    }
}

function displayCategoryTitles() {
    const categories = {
        1: CATEGORY_1,
        2: CATEGORY_2,
        3: CATEGORY_3,
    }

    for (let i = 1; i <= Object.keys(categories).length; i++) {
        const titleElement = document.getElementById(`cat-${i}-title`);
        if (!titleElement) return;

        titleElement.textContent = categories[i];
    }
}

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

async function displayCustomCategoryMovies() {
    const category = selectElement.value;
    const movies = await fetchCategoryMovies(category);
    if (!movies) return;

    for (let i = 0; i < movies.length; i++) {
        const movie = movies[i];
        const imgElement = document.querySelector(`#cat-custom-${i + 1} img`);
        imgElement.src = movie.image_url;
        imgElement.alt = `Affiche du film ${movie.title}`;

        document.querySelector(`#cat-custom-${i + 1} h3`).textContent = movie.title;
    }
}

async function displayCategoryMovies() {
    await displayCategory1Movies();
    await displayCategory2Movies();
    await displayCategory3Movies();
    await displayCustomCategoryMovies();
}

async function displayCustomCategoryChoices() {
    const categories = await fetchAllCategoriesNames();
    if (!categories) return;

    const selectElement = document.getElementById('cat-custom-select');
    for (let i = 0; i < categories.length; i++) {
        const optionElement = document.createElement('option');
        optionElement.value = categories[i];
        optionElement.textContent = categories[i];
        optionElement.classList.add('font-semibold');
        selectElement.appendChild(optionElement);
    }
}
