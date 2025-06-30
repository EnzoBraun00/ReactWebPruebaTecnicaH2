import { useState, useEffect } from 'react';

// Hook personalizado para manejar el estado persistente en localStorage
function useLocalStorage(key, initialValue) {
  // Estado para almacenar el valor
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Intenta obtener el valor de localStorage si ya existe
      const item = window.localStorage.getItem(key);
      // Parsea el JSON almacenado o devuelve el valor inicial
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Si hay un error, devuelve el valor inicial
      console.error(error);
      return initialValue;
    }
  });

  // useEffect para actualizar localStorage cada vez que el valor cambia
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]); // Dependencias: la clave y el valor almacenado

  return [storedValue, setStoredValue];
}

export default useLocalStorage;