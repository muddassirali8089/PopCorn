import { useState   , useEffect} from "react";


export function useLocalStorageState(initialState , key){
 const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);
    console.log("get the data from local storage...");

    return storedValue ? JSON.parse(storedValue) : initialState ;
  });

   useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
    console.log("the item is set sucessfullu...");
  }, [value , key]);

  return [value , setValue];
}