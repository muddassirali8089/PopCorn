
import { useEffect } from "react";

export function useKey (Key , action){

    useEffect(
    function () {
      document.addEventListener("keydown", callback);
      function callback(e) {
        
        
        if (e.code.toLowerCase() === Key.toLowerCase() ) {
          action();

          console.log(action);
          
        }
      }

      return function () {
        document.removeEventListener("keydown", callback);
      };
    },

    [action , Key]
  );

  
}