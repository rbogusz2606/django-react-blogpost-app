import { createContext, useState, useEffect } from 'react';
import { getUserDetails } from './api.jsx';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserDetails();
        setCurrentUser(userData); // Ustaw dane użytkownika
      } catch (error) {
        console.error('Błąd podczas pobierania szczegółów użytkownika:', error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, loading }}>
      {!loading && children} {/* Zapewnij wyświetlanie aplikacji po załadowaniu */}
    </AuthContext.Provider>
  );
};

export default AuthContext;