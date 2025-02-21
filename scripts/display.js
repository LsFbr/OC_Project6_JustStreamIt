document.addEventListener('DOMContentLoaded', displayBestMovie);

async function displayBestMovie() {
    const movie = await fetchBestMovie();
    if (!movie) return;

    const imgElement = document.querySelector('#meilleur-film-content img');
    imgElement.src = movie.image_url;
    imgElement.alt = `Affiche du film ${movie.title}`;
    
    document.querySelector('#meilleur-film-description h3').textContent = movie.title;
    document.querySelector('#meilleur-film-description p').textContent = movie.description;
}
