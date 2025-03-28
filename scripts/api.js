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

async function fetchBestMovies() {
    try {
        const response = await fetch(`${API_BASE_URL}/titles/?sort_by=-imdb_score&page_size=7`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const moviesIds = [];
        for (let i = 1; i < data.results.length; i++) {
            moviesIds.push(data.results[i].id);
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
        console.error('Erreur lors de la récupération des meilleurs films:', error);
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
        console.error(`Erreur lors de la récupération des films de la catégorie ${categoryName} :`, error);
        return null;
    }
}

async function fetchAllCategoriesNames() {
    try {
        const genresResponse = await fetch(`${API_BASE_URL}/genres`);
        if (!genresResponse.ok) {
            throw new Error(`HTTP error! status: ${genresResponse.status}`);
        }
        const genresData = await genresResponse.json();

        const numberOfCategories = genresData.count


        const allGenresResponse = await fetch(`${API_BASE_URL}/genres/?page_size=${numberOfCategories}`);
        if (!allGenresResponse.ok) {
            throw new Error(`HTTP error! status: ${allGenresResponse.status}`);
        }
        const allGenresData = await allGenresResponse.json();

        const allGenres = [];
        for (let i = 0; i < allGenresData.results.length; i++) {
            allGenres.push(allGenresData.results[i].name);
        }
        return allGenres;
        
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
        return null;
    }
}

async function fetchMovieDetails(movieId) {
    try {
        const response = await fetch(`${API_BASE_URL}/titles/${movieId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Erreur lors de la récupération des détails du film ${movieId} :`, error);
        return null;
    }
}
