import { useState } from "react";
import { useMovies } from "./CustomHooks/useMovies.jsx";
import { useLocalStorageState } from "./CustomHooks/useLocalStorageState.jsx";
import NavBar from "./Pages/NavBar.jsx";
import Logo from "./Components/Navbar/Logo.jsx";
import Search from "./Components/Navbar/Search.jsx";
import NumResults from "./Components/Navbar/NumResults.jsx";
import Loader from "./Components/Loader.jsx";
import ErrorMessage from "./Components/ErrorMessage.jsx";
import MovieDetails from ".//Pages/MovieDetails.jsx";
import MovieList from "./Components/MovieList.jsx";
import WatchedSummary from "./Components/WatchedSummary.jsx";
import Main from "./Pages/Main.jsx";
import WatchedMoviesList from "./Components/WatchedMoviesList.jsx";
import Box from "./Pages/Box.jsx";

const KEY = "a006f2c2";
export default function App() {
  const [query, setQuery] = useState("inception");
  const { movies, isLoading, isError } = useMovies(query);
  const [watched, setWatched] = useLocalStorageState([], "watched");

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
