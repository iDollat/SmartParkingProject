import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TextField, Button, Typography, Alert, Box } from "@mui/material";

interface Account {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface Errors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
}

const Register: React.FC = () => {
  const [account, setAccount] = useState<Account>({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const validate = (): Errors | null => {
    const validationErrors: Errors = {};

    if (account.name.trim() === "") {
      validationErrors.name = "Name is required!";
    }
    if (account.email.trim() === "") {
      validationErrors.email = "Email is required!";
    }
    if (account.phone.trim() === "") {
      validationErrors.phone = "Phone number is required!";
    }
    if (account.password.trim() === "") {
      validationErrors.password = "Password is required!";
    }

    return Object.keys(validationErrors).length === 0 ? null : validationErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors || {});
    if (validationErrors) return;

    try {
      await axios.post("http://localhost:3100/api/user/create", {
        email: account.email,
        phone: account.phone,
        name: account.name,
        password: account.password, // Wysyłamy hasło!
        role: "user", // Automatyczne przypisywanie roli
        isAdmin: false,
      });

      setSuccessMessage("Account created successfully! Redirecting...");
      setTimeout(() => {
        navigate("/login"); // Przekierowanie po kilku sekundach
      }, 3000);
    } catch (error) {
      const errorMessage =
        (error as any).response?.data?.message || "Email already taken.";
      setErrors({ email: errorMessage });
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
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
        onSubmit={handleSubmit} // Obsługa wysyłania formularza
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
          Sign Up
        </Typography>
        <Box mb={2}>
          <TextField
            label="Name"
            value={account.name}
            name="name"
            onChange={handleChange}
            fullWidth
            variant="outlined"
            error={Boolean(errors.name)}
            helperText={errors.name}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Email"
            value={account.email}
            name="email"
            onChange={handleChange}
            type="email"
            fullWidth
            variant="outlined"
            error={Boolean(errors.email)}
            helperText={errors.email}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Phone Number"
            value={account.phone}
            name="phone"
            onChange={handleChange}
            fullWidth
            variant="outlined"
            error={Boolean(errors.phone)}
            helperText={errors.phone}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Password"
            value={account.password}
            name="password"
            onChange={handleChange}
            type="password"
            fullWidth
            variant="outlined"
            error={Boolean(errors.password)}
            helperText={errors.password}
          />
        </Box>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Sign Up
        </Button>
        {Object.values(errors).some((error) => error) && (
          <Box mt={2}>
            {Object.values(errors).map(
              (error, index) =>
                error && (
                  <Alert severity="error" key={index}>
                    {error}
                  </Alert>
                )
            )}
          </Box>
        )}
        {successMessage && (
          <Box mt={2}>
            <Alert severity="success">{successMessage}</Alert>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Register;
