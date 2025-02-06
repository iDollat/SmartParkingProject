import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import car from "../img/car.png";

const settings = ["Login", "Sign Up"];

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  let userId: string | null = null;
  let isAdmin = false;

  if (token) {
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    userId = decodedToken?.userId;
    isAdmin = decodedToken?.role === "admin";
  }

  const handleLogout = async () => {
    try {
      if (!token || !userId) {
        console.error("Token or userId not available");
        return;
      }

      const response = await fetch(
        `http://localhost:3100/api/user/logout/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        console.log("Logout successful");
        localStorage.removeItem("token");
        navigate("/dashboard");
        location.reload();
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const isLoggedIn = Boolean(token);

  return (
    <AppBar position="static">
      <Toolbar>
        <Box display="flex" alignItems="center" sx={{ mr: 2 }}>
          <img src={car} width={50} alt="Logo" />
        </Box>

        <Box sx={{ display: { xs: "flex", md: "none" }, mr: 2 }}>
          <IconButton size="large" color="inherit" onClick={handleOpenNavMenu}>
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorElNav}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{ display: { xs: "block", md: "none" } }}
          >
            {isLoggedIn ? (
              <>
                {!isAdmin && (
                  <>
                    <MenuItem onClick={() => navigate("/dashboard")}>
                      <Typography textAlign="center">Dashboard</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => navigate("/current")}>
                      <Typography textAlign="center">
                        Moje rezerwacje
                      </Typography>
                    </MenuItem>
                    <MenuItem onClick={() => navigate("/report")}>
                      <Typography textAlign="center">Zgłoś</Typography>
                    </MenuItem>
                  </>
                )}

                {isAdmin && (
                  <>
                    <MenuItem onClick={() => navigate("/dashboard")}>
                      <Typography textAlign="center">Dashboard</Typography>
                    </MenuItem>

                    <MenuItem onClick={() => navigate("/admin")}>
                      <Typography textAlign="center">
                        Panel Administratora
                      </Typography>
                    </MenuItem>

                    <MenuItem onClick={() => navigate("/parkingreports")}>
                      <Typography textAlign="center">Zgłoszenia</Typography>
                    </MenuItem>
                  </>
                )}
              </>
            ) : (
              settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={() =>
                    navigate(`/${setting.toLowerCase().replace(" ", "")}`)
                  }
                >
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))
            )}
          </Menu>
        </Box>

        <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
          {!isAdmin && (
            <>
              <Button color="inherit" component={Link} to="/dashboard">
                Dashboard
              </Button>
              <Button color="inherit" component={Link} to="/current">
                Moje Rezerwacje
              </Button>
              <Button color="inherit" component={Link} to="/report">
                Zgłoś
              </Button>
            </>
          )}

          {isLoggedIn && isAdmin && (
            <>
              <Button color="inherit" component={Link} to="/dashboard">
                Dashboard
              </Button>
              <Button color="inherit" component={Link} to="/admin">
                Panel Administratora
              </Button>
              <Button color="inherit" component={Link} to="/parkingreports">
                Zgłoszenia
              </Button>
            </>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            ml: "auto",
          }}
        >
          {isLoggedIn ? (
            <Button
              onClick={handleLogout}
              color="inherit"
              sx={{ color: "white", "&:hover": { color: "#c28454" } }}
            >
              Logout
            </Button>
          ) : (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/login"
                sx={{ color: "white" }}
              >
                Log In
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/register"
                sx={{ color: "white" }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
