const movieSearchBox = document.getElementById("movie-search-box");
const movieSearchButton = document.getElementById("movie-search-btn");
const searchList = document.getElementById("search-list");
const resultGrid = document.getElementById("result-grid");

// create a state for the search box
// let movieState = [];

// create a function that updates state
// const createUpdateState = () =>  movieState.push(movieSearchBox.value);   

// create an iterable for movies
// let allMovies = document.querySelectorAll(".search-list-item");

async function loadMovies(searchTerm) {
  const URL = `https://www.omdbapi.com/?s=${searchTerm}&page=2&apikey=a1fa53b9`;
  const res = await fetch(`${URL}`);
  const data = await res.json();
  if (data.Response == "True") displayMovieList(data.Search);
}
movieSearchButton.addEventListener("click", function() {
  let searchTerm = (movieSearchBox.value).trim();
  if (searchTerm.length > 0) {
    searchList.classList.remove("hide-search-list");
    loadMovies(searchTerm);
  } else {
    searchList.classList.add("hide-search-list");
  }
  console.log("clicked search")

})

// function clearInput() {
//    if (movieSearchBox.value !== movieState[0] ){
//     alert("not equal");
//     createUpdateState();
//    }

//    console.log(allMovies)


// }

function displayMovieList(movies) {
  searchList.innerHTML = "";
  for (let i = 0; i < movies.length; i++) {
    let movieListItem = document.createElement('div');
    movieListItem.dataset.id = movies[i].imdbID;
    movieListItem.classList.add("search-list-item");
    if (movies[i].Poster !== "N/A") moviePoster = movies[i].Poster;
    else moviePoster = "no-image-found.jpg";

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
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie=> {
        movie.addEventListener('click', async()=>{
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = ''; 
            const result = await fetch(` http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=a1fa53b9`);
            const movieDetails = await result.json();
            displayMovieDetails(movieDetails);
        })
    })
}

function displayMovieDetails(details) {
  resultGrid.innerHTML = `
  <div class="movie-poster">
              <img src="${(details.Poster !== "N/A") ? details.Poster : "no-image-found.jpg"}" alt="movie-poster" />
            </div>
            <div class="movie-info">
              <h3 class="move-title">${details.Title}</h3>
              <ul class="movie-misc-info">
                <li class="year">Year: ${details.Year}</li>
                <li class="rated">Rating: ${details.Rated}</li>
                <li class="released">Released: ${details.Released}</li>
              </ul>
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

  `

}

function clearDisplay() {
    searchList.innerHTML = "";
  }
  
  movieSearchBox.addEventListener("input", function () {
    if (movieSearchBox.value.trim().length === 0) {
      clearDisplay();
      searchList.classList.add("hide-search-list");
    }
  });
 
  
  
  
  
  






// movieSearchBox.addEventListener('change',clearInput)



