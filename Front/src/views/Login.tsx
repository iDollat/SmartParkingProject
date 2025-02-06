import React, { ChangeEvent, FormEvent } from "react";
import { TextField, Button, Typography, Alert, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Account {
  login: string; // Login może być e-mail lub numer telefonu
  password: string;
}

interface Errors {
  login?: string;
  password?: string;
  general?: string;
}

const LoginForm: React.FC = () => {
  const navigate = useNavigate();

  const [account, setAccount] = React.useState<Account>({
    login: "",
    password: "",
  });

  const [errors, setErrors] = React.useState<Errors>({});

  const validate = (): Errors | null => {
    const errors: Errors = {};

    if (account.login.trim() === "") {
      errors.login = "Email or phone number is required!";
    }
    if (account.password.trim() === "") {
      errors.password = "Password is required!";
    }

    return Object.keys(errors).length === 0 ? null : errors;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors || {});
    if (validationErrors) return;

    console.log("Submitting login:", account);

    axios
      .post("http://localhost:3100/api/user/auth", {
        login: account.login, // login: email lub numer telefonu
        password: account.password,
      })
      .then((response) => {
        console.log("Login response:", response.data);
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
        location.reload();
      })
      .catch((error) => {
        console.error("Login error:", error);
        setErrors({ general: "Invalid email/phone or password" });
      });
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setAccount((prevAccount) => ({
      ...prevAccount,
      [name]: value,
    }));
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        display="flex"
        flexDirection="column"
        width="100%"
        maxWidth="500px"
        padding="24px"
        bgcolor="white"
        borderRadius="8px"
        boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        <TextField
          label="Email or Phone Number"
          value={account.login}
          name="login"
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
          error={!!errors.login}
          helperText={errors.login}
        />
        <TextField
          label="Password"
          value={account.password}
          name="password"
          onChange={handleChange}
          type="password"
          fullWidth
          margin="normal"
          variant="outlined"
          error={!!errors.password}
          helperText={errors.password}
        />
        {errors.general && <Alert severity="error">{errors.general}</Alert>}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </Box>
    </Box>
  );
};

export default LoginForm;
