import { useState, useEffect } from "react";
import { useGetMovieDetails } from "../CustomHooks/useGetMovieDetails";
import { useKey } from "../CustomHooks/useKey";
import  ErrorMessage  from "../Components/ErrorMessage.jsx";
import  Loader  from "../Components/Loader.jsx";
import StarRating from "../Components/StarRating.jsx";

export default function MovieDetails({
  selectedId, onCloseMovie, toHandleWatchedMovie, watchedMovieArray,
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


  useKey("Escape", onCloseMovie);
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
  const { movie, isLoading, isError } = useGetMovieDetails(selectedId);
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
    Title: title, Year: year, Poster: poster, Runtime: runtime, imdbRating, Plot: plot, Released: released, Actors: actors, Director: director, Genre: genre,
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
                    onSetRating={setUserRating} />
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
