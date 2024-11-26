import { Link } from "react-router-dom";
import { Box, Button } from "@mui/material";

function Dashboard() {
  return (
    <Box
      display="flex"
      height="calc(100vh - 60px)"
      flexDirection="row"
      justifyContent="center"
      alignItems="stretch"
    >
      {/* Lewa połowa */}
      <Box
        flex={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
        bgcolor="primary.main"
        sx={{
          cursor: "pointer",
          transition: "background-color 0.3s",
          "&:hover": { bgcolor: "primary.dark" },
        }}
      >
        <Button
          component={Link}
          to="/createpost"
          sx={{
            textDecoration: "none",
            color: "white",
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}
        >
          UTWÓRZ POST
        </Button>
      </Box>

      {/* Prawa połowa */}
      <Box
        flex={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
        bgcolor="secondary.main"
        sx={{
          cursor: "pointer",
          transition: "background-color 0.3s",
          "&:hover": { bgcolor: "secondary.dark" },
        }}
      >
        <Button
          component={Link}
          to="/blogposts"
          sx={{
            textDecoration: "none",
            color: "white",
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}
        >
          WYŚWIETL WSZYSTKIE POSTY
        </Button>
      </Box>
    </Box>
  );
}

export default Dashboard;
