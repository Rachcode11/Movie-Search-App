const movieSearchBox = document.getElementById("movie-search-box");
const movieSearchButton = document.getElementById("movie-search-btn");
const searchList = document.getElementById("search-list");
const resultGrid = document.getElementById("result-grid");
let viewDetailsBtn;



function loadMovies(searchTerm, page) {
  const URL = `https://www.omdbapi.com/?s=${searchTerm}&page=${page}&apikey=a1fa53b9`;
  fetch(URL)
    .then((res) => res.json())
    .then((data) => {
      if (data.Response === "True") {
        displayMovieList(data.Search);
        totalPages = Math.ceil(data.totalResults / 10);
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

function displayMovieList(movies) {
  searchList.innerHTML = "";
  for (let i = 0; i < movies.length; i++) {
    const movieListItem = document.createElement("div");
    movieListItem.dataset.id = movies[i].imdbID;
    movieListItem.classList.add("search-list-item");
    const moviePoster = movies[i].Poster !== "N/A" ? movies[i].Poster : "no-image-found.jpg";

    movieListItem.innerHTML = `
      <div class="search-item-thumbnail">
        <img src=${moviePoster} />
      </div>
      <div class="search-item-info">
        <h3>${movies[i].Title}</h3>
        <p>${movies[i].Year}</p>
      </div>
    `;

    searchList.appendChild(movieListItem);
  }
  loadMovieDetails();
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
        <p class="plot">
          <b>Plot:</b>${details.Plot}</p>
        </p>
        <p class="language"><b>Language:</b>${details.Language}</p>
        <p class="awards">
          <b><i class="fas fa-award"></i></b>${details.Awards}</p>
        </p>
        </div>
      <div class="result-display-btn">
        <button class="result-btn" id="view-details-btn">
          View details
        </button>
      </div>
    </div>
  `;

  viewDetailsBtn = document.getElementById("view-details-btn");
  let additional = document.getElementById("additional-details");

  viewDetailsBtn.addEventListener("click", function () {
    if (additional.style.display === "none") {
      additional.style.display = "block";
    }else{
      additional.style.display = "none"
    }

  });

  // function viewDetails(details) {
  //   resultGrid.innerHTML += `
  //     <div class="movie-info">
  //       <ul class="movie-misc-info">
  //       </ul>
        
  //     </div>
  //   `;
  // }
}

movieSearchBox.addEventListener("input", function () {
  if (movieSearchBox.value.trim().length === 0) {
    resultGrid.innerHTML = "";
    searchList.classList.add("hide-search-list");
  }
});
