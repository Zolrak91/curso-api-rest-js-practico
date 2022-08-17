const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
    },
});

// Utils
const lazyLoaderObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting){
            const url = entry.target.getAttribute('data-src');
            entry.target.setAttribute('src', url);
        }
    });
});

function createMovieContainer(section, movies, lazyLoad = false) {
    section.innerHTML = "";

    movies.forEach(movie => {
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        movieContainer.addEventListener('click', () => {
            location.hash = `movie=${movie.id}`;
        });

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute(
            lazyLoad ? 'data-src' : 'src', // si lazyLoad es true el valor del 1er param será 'data-src', sino 'src'
            (movie.poster_path != null) ? ('https://image.tmdb.org/t/p/w300' + movie.poster_path) : 'https://www.prachiindia.com/ModuleFiles/Items/cover_Image.png' // 2do param, es el valor del atributo(1er param)
        );

        if (lazyLoad) {
            lazyLoaderObserver.observe(movieImg);
        } 
            
        movieContainer.appendChild(movieImg);
        section.appendChild(movieContainer); // 'trendingMoviesPreviewList' tomado de nodes.js
    });
}

function createGenresContainer(section, genres) {
    section.innerHTML = '';

    genres.forEach(genre => {
        const genreContainer = document.createElement('div');
        genreContainer.classList.add('category-container');

        const genreName = document.createElement('h3');
        genreName.classList.add('category-title');
        genreName.setAttribute('id', ('id' + genre.id));
        genreName.addEventListener('click', () => {
            location.hash = `#genre=${genre.id}-${genre.name}`;
        });
        genreName.innerHTML = genre.name; // Esto lo hice diferente
        genreContainer.appendChild(genreName);
        section.appendChild(genreContainer);
    });
}

// API calls
async function getTrendingMoviesPreview() {
    const {data} = await api('/trending/movie/day');
    const movies = data.results;

    createMovieContainer(trendingMoviesPreviewList, movies, true);
}

async function getGenresPreview() {
    const {data} = await api('/genre/movie/list');
    const genres = data.genres;

    createGenresContainer(categoriesPreviewList, genres);
}

async function getMovieByGenre(id) {
    const {data} = await api('/discover/movie', {
        params: {
            with_genres: id,
        }
    });
    const movies = data.results;

    createMovieContainer(genericSection, movies);
}

async function getMovieBySearch(query) {
    const {data} = await api('/search/movie', {
        params: {
            query: query, // Al tener el mismo nombre puede ponerse simplemente: ' query, '
        }
    });
    const movies = data.results;

    createMovieContainer(genericSection, movies, true);
}

async function getTrendingMovies() {
    const {data} = await api('/trending/movie/day');
    const movies = data.results;

    createMovieContainer(genericSection, movies);
}

async function getMovieById(id) {
    const {data : movie} = await api('/movie/'+ id); //Crea la variable data y le cambia el nombre a movie (lo dejé como curiosidad)

    const movieImgURL = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
    headerSection.style.background =  `
    linear-gradient(
        180deg, 
        rgba(0, 0, 0, 0.35) 19.27%, 
        rgba(0, 0, 0, 0) 29.17%
        ),
    url(${movieImgURL})
    `;

    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;

    createGenresContainer(movieDetailCategoriesList, movie.genres);
    getRelatedMoviesById(id);
}

async function getRelatedMoviesById(id){
    const {data} = await api(`/movie/${id}/similar`);
    const relatedMovies = data.results;

    createMovieContainer(relatedMoviesContainer, relatedMovies);
}