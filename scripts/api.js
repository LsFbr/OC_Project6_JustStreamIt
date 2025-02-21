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

async function fetchCategoryMovies(categoryName) {
    try { 
        const response = await fetch(`${API_BASE_URL}/titles/?genre=${categoryName}&sort_by=-imdb_score&page_size=6`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (!data.results.length) {
            throw new Error('La catégorie n\'existe pas ou est vide');
        }

        const moviesIds = [];
        for (let i = 0; i < data.results.length; i++) {
            moviesIds.push(data.results[i].id);
        }

        if (!moviesIds) {
            throw new Error('Aucun id de film trouvé pour la catégorie');
        }

        const moviesDetails = [];
        for (let i = 0; i < moviesIds.length; i++) {
            const detailsResponse = await fetch(`${API_BASE_URL}/titles/${moviesIds[i]}`);
            if (!detailsResponse.ok) {
                throw new Error(`HTTP error! status: ${detailsResponse.status}`);
            }

            const detailsData = await detailsResponse.json();
            moviesDetails.push(detailsData);
        }
        return moviesDetails;
    } catch (error) {
        console.error('Erreur lors de la récupération des films de la catégorie:', error);
        return null;
    }
}
