import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
// import App from './App.jsx'
// import './index.css'
import StarRating from "./StarRating.jsx";

function Test() {
  const [movieRating, setmovieRating] = useState(0);
  return (
    <>
      <StarRating  onSetRating = {setmovieRating} maxRating={10} color="blue" defaultRating={3} />
      <p>The movie was rated  { movieRating} Stars </p>
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>

    <StarRating 
      
      defaultRating={5}  
      
    />

<StarRating
      maxRating={10}
      defaultRating={5}  
    />

  </StrictMode>
);
