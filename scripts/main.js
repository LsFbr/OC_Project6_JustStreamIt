const API_BASE_URL = 'http://localhost:8000/api/v1';

async function fetchBestMovie() {
    try {
        const response = await fetch(`${API_BASE_URL}/titles/?sort_by=-imdb_score&page_size=1`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const movieId = data.results[0].id;

        const detailsResponse = await fetch(`${API_BASE_URL}/titles/${movieId}`);

        if (!detailsResponse.ok) {
            throw new Error(`HTTP error! status: ${detailsResponse.status}`);
        }
        return await detailsResponse.json();
    } catch (error) {
        console.error('Erreur lors de la récupération du meilleur film:', error);
        return null;
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

document.addEventListener('DOMContentLoaded', displayBestMovie);
