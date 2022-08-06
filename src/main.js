const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
    },
});

async function getTrendingMoviesPreview() {
    const {data} = await api('/trending/movie/day');
    const movies = data.results;

    trendingMoviesPreviewList.innerHTML = '';
    
    movies.forEach(movie => {
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute('src', ('https://image.tmdb.org/t/p/w300' + movie.poster_path));

        movieContainer.appendChild(movieImg);
        trendingMoviesPreviewList.appendChild(movieContainer); // 'trendingMoviesPreviewList' tomado de nodes.js
    });
}

async function getGenresPreview() {
    const {data} = await api('/genre/movie/list');
    const genres = data.genres;

    categoriesPreviewList.innerHTML = '';

    genres.forEach(genre => {
        const genreContainer = document.createElement('div');
        genreContainer.classList.add('category-container');

        const genreName = document.createElement('h3');
        genreName.classList.add('category-title');
        genreName.setAttribute('id', ('id' + genre.id));
        genreName.innerHTML = genre.name;

        genreContainer.appendChild(genreName);
        categoriesPreviewList.appendChild(genreContainer);
    });
}