import { useState, useEffect } from "react";
import Navbar from "./components/Nav/Navbar";
import Search from "./components/Nav/Search";
import NumResults from "./components/Nav/NumResults";
import MovieList from "./components/Movie/MovieList";
import MovieDetails from "./components/Movie/MovieDetails";
import Main from "./components/Main";
import Box from "./components/Box";
import WatchedSummary from "./components/WatchedMovie/WatchedSummary";
import WatchedMovieList from "./components/WatchedMovie/WatchedMovieList";
import ErrorMessage from "./components/Messages/ErrorMessage";
import Loader from "./components/Messages/Loader";

const KEY = "9b81bdd4";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const handleSelectMovie = (id) => {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  };

  const handleCloseMovie = () => {
    setSelectedId(null);
  };

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      setError("");
      try {
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`
        );

        if (!res.ok)
          throw new Error("Something went wrong while fetching movies");

        const data = await res.json();
        console.log(data.Search);
        if (data.Response === "False") throw new Error("Movie Not Found");
        setMovies(data.Search);
      } catch (err) {
        console.log(err.message);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }

    fetchMovies();
  }, [query]);

  return (
    <>
      <Navbar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Navbar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList watched={watched} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
