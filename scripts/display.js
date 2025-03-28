document.addEventListener('DOMContentLoaded', async function() {
    await displayBestMovie();
    await displayBestMovies();
    await displayCategories();
    await displayCustomCategoryChoices();
    await displayCustomCategory();
    setupShowMoreButtons();
    setupCustomCategorySelect();
    setupModal();
});

function setupShowMoreButtons() {
    for (let i = 0; i < CATEGORIES.length+1; i++) {

        const buttonElement = document.getElementById(`cat-${i}-show-more`);
        if (!buttonElement) continue;
        
        const hiddenMovies = document.querySelectorAll(`#cat-${i}-grid .hidden`);

        buttonElement.addEventListener('click', () => {
            
            let isShowingMore = buttonElement.getAttribute('data-show-more') === 'true';

            hiddenMovies.forEach(hiddenMovie => {
                hiddenMovie.classList.toggle('hidden', isShowingMore);
                hiddenMovie.classList.toggle('block', !isShowingMore);
            });

            buttonElement.setAttribute('data-show-more', !isShowingMore);
            isShowingMore = !isShowingMore;
            buttonElement.textContent = isShowingMore ? 'Voir moins' : 'Voir plus';
        });
    }
    
    setupCustomShowMoreButton();
}

function setupCustomShowMoreButton() {
    const buttonElement = document.getElementById('cat-custom-show-more');
    if (!buttonElement) return;

    const newButton = buttonElement.cloneNode(true);
    buttonElement.parentNode.replaceChild(newButton, buttonElement);
    
    newButton.setAttribute('data-show-more', 'false');
    newButton.textContent = 'Voir plus';

    const hiddenMovies = document.querySelectorAll('#cat-custom-grid .hidden');
    
    newButton.addEventListener('click', () => {
         
        let isShowingMore = newButton.getAttribute('data-show-more') === 'true';
        
        hiddenMovies.forEach(hiddenMovie => {
            hiddenMovie.classList.toggle('hidden', isShowingMore);
            hiddenMovie.classList.toggle('block', !isShowingMore);
        });
        
        newButton.setAttribute('data-show-more', !isShowingMore);
        isShowingMore = !isShowingMore;
        newButton.textContent = isShowingMore ? 'Voir moins' : 'Voir plus';
    });
}

function setupCustomCategorySelect() {
    const selectElement = document.getElementById('cat-custom-select');
    selectElement.addEventListener('change', displayCustomCategory);
}

function setupModal() {
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('details-button')) {
            const movieId = event.target.getAttribute('data-movie-id');
            displayModal(movieId);
        }
    });

    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal-close')) {
            closeModal();
        }
    });
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
    detailsButton.setAttribute('data-movie-id', movie.id);
}

function createCategorySection(categoryId, categoryName) {
    const template = document.getElementById('category-section-template');
    const cloneCategorySection = template.content.cloneNode(true);

    const sectionElement = cloneCategorySection.querySelector('.category-section');
    sectionElement.id = "cat-" + categoryId;

    const gridElement = cloneCategorySection.querySelector('.category-grid');
    gridElement.id = "cat-" + categoryId + "-grid";

    const showMoreButton = cloneCategorySection.querySelector('.show-more-button');
    showMoreButton.id = "cat-" + categoryId + "-show-more";

    const titleElement = cloneCategorySection.querySelector('.category-title');
    titleElement.textContent = categoryName;

    return cloneCategorySection;
}

function createMovieCard(movie) {
    const template = document.getElementById('movie-card-template');
    const cloneMovieCard = template.content.cloneNode(true);

    const imgElement = cloneMovieCard.querySelector('img');
    imgElement.onerror = () => {
        imgElement.src = 'images/no_image.png';
    };
    imgElement.src = movie.image_url;
    imgElement.alt = `Affiche du film ${movie.title}`;

    const titleElement = cloneMovieCard.querySelector('h3');
    titleElement.textContent = movie.title;

    const detailsButton = cloneMovieCard.querySelector('.details-button');
    detailsButton.setAttribute('data-movie-id', movie.id);

    return cloneMovieCard;
}

async function displayBestMovies() {
    const movies = await fetchBestMovies();
    if (!movies) return;

    const bestMoviesSection = createCategorySection('0', "Meilleurs films");

    for (let i = 0; i < movies.length; i++) {
        const movie = movies[i];
        const movieCard = createMovieCard(movie);

        const movieCardElement = movieCard.querySelector('.movie-card');

        if (i >= 2 && i <= 3) {
            movieCardElement.classList.add('hidden', 'md:block');
        }
        if (i >= 4) {
            movieCardElement.classList.add('hidden', 'lg:block');
        }

        bestMoviesSection.querySelector('.category-grid').appendChild(movieCard);
    }

    const movieCardsNumber = bestMoviesSection.querySelectorAll('.movie-card').length;
    const showMoreButtonElement = bestMoviesSection.querySelector('.show-more-button');
    const gridElement = bestMoviesSection.querySelector('.category-grid');
    setupResponsiveGrid(movieCardsNumber, gridElement, showMoreButtonElement);

    const bestMovieSectionElement = document.getElementById('meilleur-film');
    document.querySelector('main').insertBefore(bestMoviesSection, bestMovieSectionElement.nextSibling);
}

async function displayCategories() {
    for (let i = 0; i < CATEGORIES.length; i++) {
        const categoryName = CATEGORIES[i];
        const categorySection = createCategorySection(i + 1, categoryName);

        const movies = await fetchCategoryMovies(categoryName);
        if (!movies) continue;

        for (let j = 0; j < movies.length; j++) {
            const movie = movies[j];
            const movieCard = createMovieCard(movie);

            const movieCardElement = movieCard.querySelector('.movie-card');
            
            if (j >= 2 && j <= 3) {
                movieCardElement.classList.add('hidden', 'md:block');
            }
            if (j >= 4) {
                movieCardElement.classList.add('hidden', 'lg:block');
            }

            categorySection.querySelector('.category-grid').appendChild(movieCard);
        }

        const movieCardsNumber = categorySection.querySelectorAll('.movie-card').length;
        const showMoreButtonElement = categorySection.querySelector('.show-more-button');
        const gridElement = categorySection.querySelector('.category-grid');
        setupResponsiveGrid(movieCardsNumber, gridElement, showMoreButtonElement);

        const customCategorySection = document.getElementById('cat-custom');
        document.querySelector('main').insertBefore(categorySection, customCategorySection);
    }
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

async function displayCustomCategory() {
    const selectElement = document.getElementById('cat-custom-select');
    const category = selectElement.value;
    const movies = await fetchCategoryMovies(category);
    if (!movies) return;

    const customCategorySection = document.getElementById('cat-custom');
    const gridElement = document.getElementById('cat-custom-grid');

    if (gridElement) {
        gridElement.innerHTML = '';
    }

    for (let i = 0; i < movies.length; i++) {
        const movie = movies[i];
        const movieCard = createMovieCard(movie);

        const movieCardElement = movieCard.querySelector('.movie-card');
        
        if (i >= 2 && i <= 3) {
            movieCardElement.classList.add('hidden', 'md:block');
        } else if (i >= 4) {
            movieCardElement.classList.add('hidden', 'lg:block');
        }

        gridElement.appendChild(movieCard);
    }


    const movieCardsNumber = customCategorySection.querySelectorAll('.movie-card').length;
    const showMoreButtonElement = document.getElementById('cat-custom-show-more');
    setupResponsiveGrid(movieCardsNumber, gridElement, showMoreButtonElement);
    
    setupCustomShowMoreButton();
}

function setupResponsiveGrid(movieCardsNumber, gridElement, showMoreButtonElement) {
    if (movieCardsNumber <= 1) {
        gridElement.classList.add('grid-rows-1');
        showMoreButtonElement.classList.add('hidden');
    } else if (movieCardsNumber <= 2) {
        gridElement.classList.add('grid-rows-2', 'md:grid-rows-1');
        showMoreButtonElement.classList.add('hidden');
    } else if (movieCardsNumber <= 3) {
        gridElement.classList.add('grid-rows-2', 'lg:grid-rows-1');
        showMoreButtonElement.classList.add('md:hidden');
        showMoreButtonElement.classList.remove('hidden', 'lg:hidden');
    } else if (movieCardsNumber <= 4) {
        gridElement.classList.add('grid-rows-2');
        showMoreButtonElement.classList.add('md:hidden');
        showMoreButtonElement.classList.remove('hidden', 'lg:hidden');
    } else if (movieCardsNumber > 4) {
        gridElement.classList.add('grid-rows-2');
        showMoreButtonElement.classList.add('lg:hidden');
        showMoreButtonElement.classList.remove('hidden', 'md:hidden');
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
        let grossIncome = formatCurrency(movieDetails.worldwide_gross_income);
        if (grossIncome) {
            modalGrossIncome.textContent = "Recette au box-office: " + grossIncome;
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

        const modalImages = document.querySelectorAll('.modal-image');
        modalImages.forEach(modalImage => {
            modalImage.onerror = () => {
                modalImage.src = 'images/no_image.png';
            };
            modalImage.src = movieDetails.image_url;
            modalImage.alt = `Affiche du film ${movieDetails.title}`;
        });

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
