import { Link } from "react-router-dom";
import Logout from "./login/logout";
import { AppBar, Toolbar, Button, Box } from "@mui/material";

function Navbar({ setIsAuthenticated }) {
  return (
    <AppBar position="static" sx={{ bgcolor: "green" }}>
      <Toolbar>
        {/* Logo lub tytuł nawigacji */}
        <Box sx={{ flexGrow: 1 }}>
          <Button
            component={Link}
            to="/dashboard"
            sx={{
              color: "white",
              fontWeight: "bold",
              fontSize: "1rem",
              textDecoration: "none",
            }}
          >
            Strona Główna
          </Button>
        </Box>

        {/* Linki nawigacyjne */}
        <Button
          component={Link}
          to="/createpost"
          sx={{
            color: "white",
            fontSize: "1rem",
            textDecoration: "none",
            marginLeft: "10px",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.2)", // Lekko zmienione tło
            },
            "&:focus": {
              outline: "2px solid rgba(255, 255, 255, 0.8)", // Obrys przy focus
            },
          }}
        >
          Stwórz Post
        </Button>
        <Button
          component={Link}
          to="/blogposts"
          sx={{
            color: "white",
            fontSize: "1rem",
            textDecoration: "none",
            marginLeft: "10px",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.2)", // Lekko zmienione tło
            },
            "&:focus": {
              outline: "2px solid rgba(255, 255, 255, 0.8)", // Obrys przy focus
            },
          }}
        >
          Wyświetl posty
        </Button>
        <Logout setIsAuthenticated={setIsAuthenticated} />
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
