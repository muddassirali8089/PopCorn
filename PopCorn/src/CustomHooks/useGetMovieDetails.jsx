import { useState, useEffect } from "react";

const KEY = "a006f2c2";

export function useGetMovieDetails(selectedId) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setError] = useState("");

  useEffect(() => {
    if (!selectedId) return; // ✅ Don't fetch if no ID

    async function getMovieDetails() {
      setIsLoading(true);
      setError("");

      try {
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );

        if (!res.ok) {
          throw new Error("Something went wrong with data fetching...");
        }

        const data = await res.json();
        setMovie(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    getMovieDetails();
  }, [selectedId]);

  return { movie, isLoading, isError };
}
