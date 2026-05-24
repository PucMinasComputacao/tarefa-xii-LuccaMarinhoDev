const API_KEY = "127f7b917092c7968eb8f4c6e236cd09"
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

const movieList = document.getElementById("movie-list");
const message = document.getElementById("message");
const searchInput = document.getElementById("search");
const btnSearch = document.getElementById("btnSearch");

// Busca filmes
async function fetchMovies(query = "") {

    try {

        showMessage("Carregando filmes...");

        let url = "";

        if (query) {
            url = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${query}`;
        } else {
            url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Erro ao buscar filmes");
        }

        const data = await response.json();

        return data.results;

    } catch (error) {

        showMessage("Erro ao carregar filmes.");
        console.error(error);

        return [];
    }
}

// Cria card do filme
function createMovieCard(movie) {

    const card = document.createElement("div");
    card.classList.add("movie-card");

    const poster = document.createElement("img");

    if (movie.poster_path) {
        poster.src = `${IMAGE_URL}${movie.poster_path}`;
    } else {
        poster.src = "https://via.placeholder.com/500x750?text=Sem+Imagem";
    }

    poster.alt = movie.title;

    const info = document.createElement("div");
    info.classList.add("movie-info");

    const title = document.createElement("h2");
    title.textContent = movie.title;

    const year = document.createElement("p");
    year.textContent = `Ano: ${movie.release_date?.slice(0, 4) || "N/A"}`;

    const rating = document.createElement("p");
    rating.textContent = `Nota: ${movie.vote_average}`;

    const overview = document.createElement("p");

    let text = movie.overview || "Sem descrição disponível.";

    if (text.length > 120) {
        text = text.slice(0, 120) + "...";
    }

    overview.textContent = text;

    info.appendChild(title);
    info.appendChild(year);
    info.appendChild(rating);
    info.appendChild(overview);

    card.appendChild(poster);
    card.appendChild(info);

    return card;
}

// Renderiza filmes
function renderMovies(movies) {

    movieList.innerHTML = "";

    if (movies.length === 0) {
        showMessage("Nenhum filme encontrado.");
        return;
    }

    showMessage("");

    movies.forEach(movie => {

        const card = createMovieCard(movie);
        movieList.appendChild(card);

    });
}

// Mostra mensagens
function showMessage(text) {
    message.textContent = text;
}

// Inicializa página
async function init() {

    const movies = await fetchMovies();
    renderMovies(movies);

}

// Evento do botão
btnSearch.addEventListener("click", async () => {

    const query = searchInput.value.trim();

    const movies = await fetchMovies(query);

    renderMovies(movies);

});

// Permite pesquisar apertando Enter
searchInput.addEventListener("keypress", async (event) => {

    if (event.key === "Enter") {

        const query = searchInput.value.trim();

        const movies = await fetchMovies(query);

        renderMovies(movies);
    }
});

init();