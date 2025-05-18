
import { useEffect , useState } from "react";
 
export function useMovies(query){

const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setError] = useState("");

const KEY = "a006f2c2";
    useEffect(
           
    function () {

       
      const controller = new AbortController();
      async function fetchMovies() {
        setIsLoading(true);
        setError("");
        try {
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );
          if (!res.ok) {
            throw new Error("some thing went wrong with movie data fetching");
          }
          const data = await res.json();
          console.log(data);

          if (data.Response === "False") {
            setMovies([]);
            throw new Error("Movie not found");
          }
          setError("");
          setMovies(data.Search);
        } catch (err) {
          if (err.name !== "AbortError") {
            setError(err.message);
          }

          if (err.name === "AbortError") {
            console.log("✅ Request aborted:", err);
            return;
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
   
      fetchMovies();
      return () => {
        console.log("🧹 Cleanup: aborting previous request");
        controller.abort(); // abort previous fetch before next starts
      };
    },
    [query]
  );
return { movies, isLoading, isError  , KEY};
}
