import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating.jsx";
import { useMovies } from "./CustomHooks/useMovies.jsx";
import { useLocalStorageState } from "./CustomHooks/useLocalStorageState.jsx";
import{useKey} from "./CustomHooks/useKey.jsx";
import { useGetMovieDetails } from "./CustomHooks/useGetMovieDetails.jsx";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "a006f2c2";
export default function App() {
  const [query, setQuery] = useState("inception");
  const { movies , isLoading , isError} = useMovies(query);
   const [watched , setWatched] = useLocalStorageState([] , "watched");

  // const [watched, setWatched] = useState(() => {
  //   const storedValue = localStorage.getItem("watched");
  //   console.log("get the data from local storage...");

  //   return storedValue ? JSON.parse(storedValue) : [] ;
  // });

  

  const [selectedId, setSelectedId] = useState(null);

  function handleDeleteWatchedMovie(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
    // when the condation is true it will retyrn the newAarray
    //when the condation is false it will filter it
  }

  function handleSelectMovie(movieId) {
    setSelectedId((selectedId) => (movieId === selectedId ? null : movieId));
  }
  function handleAddWatchedMovie(movie) {
    setWatched((watched) => [...watched, movie]);

    // localStorage.setItem("watched" , JSON.stringify([...watched , movie])  )
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  // useEffect(() => {
  //   localStorage.setItem("watched", JSON.stringify(watched));
  //   console.log("the item is set sucessfullu...");
  // }, [watched]);

  // useEffect(
  //   function () {
  //     const controller = new AbortController();
  //     async function fetchMovies() {
  //       setIsLoading(true);
  //       setError("");
  //       try {
  //         const res = await fetch(
  //           `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
  //           { signal: controller.signal }
  //         );
  //         if (!res.ok) {
  //           throw new Error("some thing went wrong with movie data fetching");
  //         }
  //         const data = await res.json();
  //         console.log(data);

  //         if (data.Response === "False") {
  //           setMovies([]);
  //           throw new Error("Movie not found");
  //         }
  //         setError("");
  //         setMovies(data.Search);
  //       } catch (err) {
  //         if (err.name !== "AbortError") {
  //           setError(err.message);
  //         }

  //         if (err.name === "AbortError") {
  //           console.log("✅ Request aborted:", err);
  //           return;
  //         }
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     }

  //     if (query.length < 3) {
  //       setMovies([]);
  //       setError("");
  //       return;
  //     }
  //     handleCloseMovie();
  //     fetchMovies();
  //     return () => {
  //       console.log("🧹 Cleanup: aborting previous request");
  //       controller.abort(); // abort previous fetch before next starts
  //     };
  //   },
  //   [query]
  // );

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} onSetQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}

          {!isLoading && !isError && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {isError && <ErrorMessage message={isError} />}

          {/* {isLoading ? <Loader/> :<MovieList movies={movies} />} */}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              toHandleWatchedMovie={handleAddWatchedMovie}
              watchedMovieArray={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onHandleDeleteWatchedMovie={handleDeleteWatchedMovie}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function MovieDetails({
  selectedId,
  onCloseMovie,
  toHandleWatchedMovie,
  watchedMovieArray,
}) {
  // const [movie, setMovie] = useState({});
  // const [isLoading, setIsLoading] = useState(false);
  // const [isError, setError] = useState("");
  const [userRating, setUserRating] = useState("");
  const isWatched = watchedMovieArray
    .map((movie) => movie.imdbID)
    .includes(selectedId);

  const watchedUserRating = watchedMovieArray.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;


  useKey("Escape" , onCloseMovie);
  // useEffect(
  //   function () {
  //     document.addEventListener("keydown", callback);
  //     function callback(e) {
  //       if (e.code === "Escape") {
  //         onCloseMovie();
  //         console.log("closed");
  //       }
  //     }

  //     return function () {
  //       document.removeEventListener("keydown", callback);
  //     };
  //   },

  //   [onCloseMovie]
  // );
  const { movie , isLoading , isError} = useGetMovieDetails(selectedId);
  // useEffect(
  //   function () {
  //     async function getMovieDetails() {
  //       setIsLoading(true);

  //       try {
  //         const res = await fetch(
  //           `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
  //         );
  //         const data = await res.json();
  //         if (!res.ok) {
  //           throw new Error("some thing wrong with data fetching...");
  //         }

  //         setMovie(data);

  //         setIsLoading(false);
  //       } catch (error) {
  //         setError(error.message);
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     }
  //     getMovieDetails();
  //   },
  //   [selectedId]
  // );

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  // create a function that call the upper function to update the state
  function handleAddMovie() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };

    toHandleWatchedMovie(newWatchedMovie);
    onCloseMovie(null);
  }
  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie ${title}`;

      return function () {
        document.title = "PopCorn";
        console.log(`clean up effect for the movie ${title}`);
      };
    },
    [title]
  );
  return (
    <div className="details">
      {isLoading && <Loader />}

      {!isLoading && !isError && (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie}`} />

            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span> {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={32}
                    onSetRating={setUserRating}
                  />
                  {userRating && (
                    <button
                      className="btn-add"
                      onClick={handleAddMovie} // no need to pass selectedId
                    >
                      + Add to List
                    </button>
                  )}
                </>
              ) : (
                <p>You rated this movie ⭐ {watchedUserRating}</p>
              )}
            </div>

            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
      {isError && <ErrorMessage message={isError} />}
    </div>
  );
}

function ErrorMessage({ message }) {
  return <p className="error"> {message}</p>;
}
function Loader() {
  return <p className="loader"> Loading....</p>;
}
function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}
function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1 className="PopCorn">Popcorn</h1>
    </div>
  );
}

function Search({ query, onSetQuery }) {
  const search = useRef(null);
useEffect(() => {
    search.current.focus();
  }, []);

  useKey("Enter" , function(){
    

    
    if(document.activeElement === search.current)
        return
      // it well focus again..
      search.current.focus();
        onSetQuery("");

  } )
  // useEffect(function () {
  //   search.current.focus()
  //   function callback(e) {
      
  //     if(document.activeElement === search.current)
  //       return
  //     if (e.code === "Enter") {
  //       search.current.focus();
  //       onSetQuery("");
  //     }
  //   }

  //   document.addEventListener("keydown", callback);
  //   return () => document.removeEventListener("keydown", callback);

  // }, [onSetQuery]);

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => onSetQuery(e.target.value)}
      ref={search}
    />
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

// function WatchedBox() {
//   const [isOpen2, setIsOpen2] = useState(true);
//   const [watched, setWatched] = useState(tempWatchedData);

//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && (
//         <>
//
//         </>
//       )}
//     </div>
//   );
// }

function WatchedMoviesList({ watched, onHandleDeleteWatchedMovie }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          onHandleDeleteWatchedMovie={onHandleDeleteWatchedMovie}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onHandleDeleteWatchedMovie }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => onHandleDeleteWatchedMovie(movie.imdbID)}
        >
          X
        </button>
      </div>
    </li>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>

      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(2)} min</span>
        </p>
      </div>
    </div>
  );
}
