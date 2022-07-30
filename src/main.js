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

    movies.forEach(movie => {
        const moviesTrendingPreview = document.querySelector('#trendingPreview .trendingPreview-movieList');

        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute('src', ('https://image.tmdb.org/t/p/w300' + movie.poster_path));

        movieContainer.appendChild(movieImg);
        moviesTrendingPreview.appendChild(movieContainer);
    });
}

async function getGenresPreview() {
    const {data} = await api('/genre/movie/list');
    const genres = data.genres;

    genres.forEach(genre => {
        const genrePreview = document.querySelector('#categoriesPreview .categoriesPreview-list');

        const genreContainer = document.createElement('div');
        genreContainer.classList.add('category-container');

        const genreName = document.createElement('h3');
        genreName.classList.add('category-title');
        genreName.setAttribute('id', ('id' + genre.id));
        genreName.innerHTML = genre.name;

        genreContainer.appendChild(genreName);
        genrePreview.appendChild(genreContainer);
    });
}

getTrendingMoviesPreview();
getGenresPreview();