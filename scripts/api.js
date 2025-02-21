async function fetchBestMovie() {
    try {
        const response = await fetch(`${API_BASE_URL}/titles/?sort_by=-imdb_score&page_size=1`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const movieId = data.results[0].id;
        if (!movieId) {
            throw new Error('Aucun id de film trouvé');
        }

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
