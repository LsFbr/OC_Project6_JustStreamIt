document.addEventListener('DOMContentLoaded',displayBestMovie);
document.addEventListener('DOMContentLoaded',displayCategoryMovies);
document.addEventListener('DOMContentLoaded',displayCustomCategoryChoices);
document.addEventListener('DOMContentLoaded',displayCategoryTitles);
document.addEventListener('DOMContentLoaded',setupShowMoreButtons);

const selectElement = document.getElementById('cat-custom-select');
selectElement.addEventListener('change', displayCustomCategoryMovies);

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('details-button')) {
        const movieId = event.target.getAttribute('movie-id');
        displayModal(movieId);
    }
});

document.addEventListener('click', (event) => {
    if (event.target.id === 'close-modal') {
        closeModal();
    }
});

function setupShowMoreButtons() {
    const categoryIdentifiers = ['cat-1', 'cat-2', 'cat-3', 'cat-custom'];
    for (let i = 0; i < categoryIdentifiers.length; i++) {
        const buttonElement = document.getElementById(`${categoryIdentifiers[i]}-show-more`);
        if (!buttonElement) continue;

        const hiddenMovies = document.querySelectorAll(`#${categoryIdentifiers[i]}-grid .hidden`);

        buttonElement.addEventListener('click', () => {
            
            let isShowingMore = buttonElement.getAttribute('show-more') === 'true';

            hiddenMovies.forEach(hiddenMovie => {
                hiddenMovie.classList.toggle('hidden', isShowingMore);
                hiddenMovie.classList.toggle('block', !isShowingMore);
            });

            buttonElement.setAttribute('show-more', !isShowingMore);
            isShowingMore = !isShowingMore;
            buttonElement.textContent = isShowingMore ? 'Voir moins' : 'Voir plus';
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

    const detailsButton = document.querySelector('#meilleur-film-content .details-button');
    detailsButton.setAttribute('movie-id', movie.id);
}

async function displayCategory1Movies() {
    const movies = await fetchCategoryMovies(CATEGORY_1);
    if (!movies) return;

    for (let i = 0; i < movies.length; i++) {
        const movie = movies[i];

        const imgElement = document.querySelector(`#cat-1-${i + 1} img`);
        imgElement.onerror = () => {
            imgElement.src = 'images/no_image.png';
        };
        imgElement.src = movie.image_url;
        imgElement.alt = `Affiche du film ${movie.title}`;

        document.querySelector(`#cat-1-${i + 1} h3`).textContent = movie.title;

        const detailsButton = document.querySelector(`#cat-1-${i + 1} .details-button`);
        detailsButton.setAttribute('movie-id', movie.id);
    }
}

async function displayCategory2Movies() {
    const movies = await fetchCategoryMovies(CATEGORY_2);
    if (!movies) return;

    for (let i = 0; i < movies.length; i++) {
        const movie = movies[i];

        const imgElement = document.querySelector(`#cat-2-${i + 1} img`);
        imgElement.onerror = () => {
            imgElement.src = 'images/no_image.png';
        };
        imgElement.src = movie.image_url;
        imgElement.alt = `Affiche du film ${movie.title}`;

        document.querySelector(`#cat-2-${i + 1} h3`).textContent = movie.title;
        
        const detailsButton = document.querySelector(`#cat-2-${i + 1} .details-button`);
        detailsButton.setAttribute('movie-id', movie.id);
    }
}

async function displayCategory3Movies() {
    const movies = await fetchCategoryMovies(CATEGORY_3);
    if (!movies) return;

    for (let i = 0; i < movies.length; i++) {
        const movie = movies[i];

        const imgElement = document.querySelector(`#cat-3-${i + 1} img`);
        
        imgElement.onerror = () => {
            imgElement.src = 'images/no_image.png';
        };
        imgElement.src = movie.image_url;
        imgElement.alt = `Affiche du film ${movie.title}`;

        document.querySelector(`#cat-3-${i + 1} h3`).textContent = movie.title;

        const detailsButton = document.querySelector(`#cat-3-${i + 1} .details-button`);
        detailsButton.setAttribute('movie-id', movie.id);
    }
}

async function displayCustomCategoryMovies() {
    const category = selectElement.value;
    const movies = await fetchCategoryMovies(category);
    if (!movies) return;

    for (let i = 0; i < movies.length; i++) {
        const movie = movies[i];
        const imgElement = document.querySelector(`#cat-custom-${i + 1} img`);
        imgElement.onerror = () => {
            imgElement.src = 'images/no_image.png';
        };
        imgElement.src = movie.image_url;
        imgElement.alt = `Affiche du film ${movie.title}`;

        document.querySelector(`#cat-custom-${i + 1} h3`).textContent = movie.title;

        const detailsButton = document.querySelector(`#cat-custom-${i + 1} .details-button`);
        detailsButton.setAttribute('movie-id', movie.id);

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

async function displayModal(movieId) {
    try {
        const movieDetails = await fetchMovieDetails(movieId);
        if (!movieDetails) {
            throw new Error('Aucun détail de film trouvé');
        }

        const modal = document.getElementById('modal');
        modal.classList.remove('hidden');

        const modalTitle = document.getElementById('modal-title');
        modalTitle.textContent = movieDetails.title;

        const modalYear = document.getElementById('modal-year');
        modalYear.textContent = movieDetails.year;

        const modalGenres = document.getElementById('modal-genres');
        modalGenres.textContent = "\u00A0- " + movieDetails.genres.join(', ');

        const modalRated = document.getElementById('modal-rated');
        if (Number.isInteger(parseInt(movieDetails.rated,10))) {
            modalRated.textContent = "PG-" + movieDetails.rated + " -\u00A0";
        } else {
            modalRated.textContent = "";
        }

        const modalDuration = document.getElementById('modal-duration');
        modalDuration.textContent = movieDetails.duration + " minutes";

        const modalCountries = document.getElementById('modal-countries');
        modalCountries.textContent = "\u00A0(" + movieDetails.countries.join(' / ') + ")";

        const modalImdbScore = document.getElementById('modal-imdb-score');
        modalImdbScore.textContent = "IMDB Score: " + movieDetails.imdb_score + "/10";

        const modalGrossIncome = document.getElementById('modal-gross-income');
        if (movieDetails.worldwide_gross_income) {
            modalGrossIncome.textContent = "Recette au box-office: " + movieDetails.worldwide_gross_income + " $";
        } else {
            modalGrossIncome.textContent = "";
        }

        const modalDirectors = document.getElementById('modal-directors');
        if (modalDirectors) {
            const directorsLabel = document.getElementById('modal-directors-label');
            directorsLabel.textContent = "Réalisé par:";          
            modalDirectors.textContent = movieDetails.directors.join(', ');
        } else {
            directorsLabel.textContent = "";
        }

        const modalLongDescription = document.getElementById('modal-long-description');
        modalLongDescription.textContent = movieDetails.long_description;

        const modalImage = document.getElementById('modal-image');
        modalImage.onerror = () => {
            modalImage.src = 'images/no_image.png';
        };
        modalImage.src = movieDetails.image_url;
        modalImage.alt = `Affiche du film ${movieDetails.title}`;

        const modalActors = document.getElementById('modal-actors');
        if (modalActors) {
            const actorsLabel = document.getElementById('modal-actors-label');
            actorsLabel.textContent = "Avec:";
            modalActors.textContent = movieDetails.actors.join(', ');
        } else {
            actorsLabel.textContent = "";
        }





        modal.classList.remove('hidden');    
    } catch (error) {
        console.error('Erreur lors de la récupération des détails du film:', error);
    }   
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.add('hidden');
}
