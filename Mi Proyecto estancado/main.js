// ERRORES EN CONSOLA:
// 1. Uncaught TypeError: callback is not a function at window.addEventListener.passive (main.js:80:13).
// 2. Uncaught (in promise) o {message: 'Request failed with status code 422', name: 'AxiosError', code: 'ERR_BAD_REQUEST', config: {…}, request: XMLHttpRequest, …} getMovieByGenre @ main.js:111
// 3. GET https://api.themoviedb.org/3/discover/movie?api_key=5e3057a7eada87f85f0f9a0bdac62d12&with_genres=543&page=543 422
    // (anónimas) @ isAxiosError.js:12
    // e.exports @ isAxiosError.js:12
    // e.exports @ isAxiosError.js:12
    // l.request @ isAxiosError.js:12
    // (anónimas) @ isAxiosError.js:12
    // getMovieByGenre @ main.js:101
    // window.addEventListener.passive @ main.js:80

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

function createMovieContainer(
        section, 
        movies, 
        {lazyLoad = true, clean = true} = {}
    ) {
    if (clean) {
        section.innerHTML = "";
    }

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

function scrollListener (callback){
    window.addEventListener('scroll', () => {
        const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
        const isScrollBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
        if (isScrollBottom) {
            page++;
            callback(page);
        }
    }, {passive: false});
}

// API calls
async function getTrendingMoviesPreview() {
    const {data} = await api('/trending/movie/day');
    const movies = data.results;

    createMovieContainer(trendingMoviesPreviewList, movies);
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
            page,
        }
    });
    const movies = data.results;

    createMovieContainer(genericSection, movies); // {lazyLoad: true, clean: page == 1}
    scrollListener(getMovieByGenre);
}

async function getMovieBySearch(query) {
    const {data} = await api('/search/movie', {
        params: {
            query: query, // Al tener el mismo nombre puede ponerse simplemente: ' query, '
        }
    });
    const movies = data.results;

    createMovieContainer(genericSection, movies);
}

// Problema con las paginas, ver funcion de scrollListener
async function getTrendingMovies() {
    const {data} = await api('/trending/movie/day', {
        params: {
            page,
        },
    });
    const movies = data.results;

    createMovieContainer(genericSection, movies, {lazyLoad: true, clean: page == 1}); // Limpia si page = 1
    scrollListener(getTrendingMovies);

    // Codigo que funciona, convertido a function en utils as scrollListener
    // window.addEventListener('scroll', () => {
    //     const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
    //     const isScrollBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);

    //     if (isScrollBottom) {
    //         getTrendingMovies(page+1); // DEBO REEMPLAZAR ESTE SISTEMA POR UNA VARIABLE QUE GUARDE PAGE, PARA PROBAR
    //     }
    // });
    
    // BOTON DE CARGAR MAS
    // const btnLoadMore = document.createElement('button');
    // btnLoadMore.innerHTML = "Cargar más";
    // genericSection.appendChild(btnLoadMore);
    // btnLoadMore.addEventListener('click', () => {
    //     getTrendingMovies(page+1);
    //     btnLoadMore.remove();
    // });
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