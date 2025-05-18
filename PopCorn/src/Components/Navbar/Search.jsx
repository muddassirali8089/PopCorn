import { useRef, useEffect } from "react";
import { useKey } from "../../CustomHooks/useKey";

export default function Search({ query, onSetQuery }) {
  const search = useRef(null);
  useEffect(() => {
    search.current.focus();
  }, []);

  useKey("Enter", function () {
    if (document.activeElement === search.current) return;
    // it well focus again..
    search.current.focus();
    onSetQuery("");
  });
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
