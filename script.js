const movieSearchBox = document.getElementById("movie-search-box");
const movieSearchButton = document.getElementById("movie-search-btn");
const searchList = document.getElementById("search-list");
const resultGrid = document.getElementById("result-grid");
const nav = document.getElementById("nav");

let movieResults = []
let pageIndex = 0;
let itemsPerPage = 3;

function loadMovies(searchTerm) {
  const URL = `https://www.omdbapi.com/?s=${searchTerm}&page=&apikey=a1fa53b9`;
  fetch(URL)
    .then((res) => res.json())
    .then((data) => {
      if (data.Response === "True") {
        movieResults = data.Search;
        displayMovieList();
        loadPageNav();
      } else {
        displayErrorMessage("No results found.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      displayErrorMessage("An error occurred while fetching data.");
    });
}

function displayErrorMessage(message) {
  searchList.innerHTML = `<p class="error-message">${message}</p>`;
}

movieSearchButton.addEventListener("click", function () {
  const searchTerm = movieSearchBox.value.trim();
  if (searchTerm.length > 0) {
    searchList.classList.remove("hide-search-list");
    loadMovies(searchTerm);
  } else {
    searchList.classList.add("hide-search-list");
  }
});

function displayMovieList() {
  const startIndex = pageIndex * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedMovies = movieResults.slice(startIndex, endIndex);

  searchList.innerHTML = "";
  displayedMovies.forEach((movie) => {
    const movieListItem = document.createElement("div");
    movieListItem.dataset.id = movie.imdbID;
    movieListItem.classList.add("search-list-item");
    const moviePoster = movie.Poster !== "N/A" ? movie.Poster : "no-image-found.jpg";

    movieListItem.innerHTML = `
      <div class="search-item-thumbnail">
        <img src=${moviePoster} />
      </div>
      <div class="search-item-info">
        <h3>${movie.Title}</h3>
        <p>${movie.Year}</p>
      </div>
    `;

    searchList.appendChild(movieListItem);
  });

  loadMovieDetails();
}
function loadPageNav() {
  nav.innerHTML = "";
  const totalPages = Math.ceil(movieResults.length / itemsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const span = document.createElement("span");
    span.textContent = i;
    span.addEventListener("click", (e) => {
      pageIndex = e.target.textContent - 1;
      displayMovieList();
      const spans = document.querySelectorAll("#nav span");
      spans.forEach((span) => span.classList.remove("active"));
      e.target.classList.add("active");
    });
    if (i === 1) {
      span.classList.add("active");
    }

    nav.appendChild(span);
  }
}


function loadMovieDetails() {
  const searchListMovies = searchList.querySelectorAll(".search-list-item");
  searchListMovies.forEach((movie) => {
    movie.addEventListener("click", async () => {
      searchList.classList.add("hide-search-list");
      movieSearchBox.value = "";
      const result = await fetch(
        `http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=a1fa53b9`
      );
      const movieDetails = await result.json();
      displayMovieDetails(movieDetails);
    });
  });
}

function displayMovieDetails(details) {
  resultGrid.innerHTML = `
    <div class="movie-poster">
      <img src="${details.Poster !== "N/A" ? details.Poster : "no-image-found.jpg"}" alt="movie-poster" />
    </div>
    <div class="movie-info">
      <h3 class="move-title">${details.Title}</h3>
      <ul class="movie-misc-info">
        <li class="year">Year: ${details.Year}</li>
        <li class="rated">Rating: ${details.Rated}</li>
        <li class="released">Released: ${details.Released}</li>
      </ul>
      <div id="additional-details">
        <p class="genre"><b>Genre:</b>${details.Genre}</p>
        <p class="writer"><b>Writer:</b>${details.Writer}</p>
        <p class="actors"><b>Actor:</b>${details.Actors}</p>
        <p class="plot"><b>Plot:</b>${details.Plot}</p>
        <p class="language"><b>Language:</b>${details.Language}</p>
        <p class="awards"><b><i class="fas fa-award"></i></b>${details.Awards}</p>
      </div>
      <div class="result-display-btn">
        <button class="result-btn" id="view-details-btn">View details</button>
      </div>
    </div>
  `;

  const viewDetailsBtn = document.getElementById("view-details-btn");
  const additionalDetails = document.getElementById("additional-details");

  viewDetailsBtn.addEventListener("click", function () {
    additionalDetails.style.display = additionalDetails.style.display === "none" ? "block" : "none";
  });
}

movieSearchBox.addEventListener("input", function () {
  if (movieSearchBox.value.trim().length === 0) {
    resultGrid.innerHTML = "";
    searchList.classList.add("hide-search-list");
  }
});
