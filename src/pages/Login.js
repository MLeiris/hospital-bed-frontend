import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { login as loginAPI } from "../api/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import { Visibility, VisibilityOff, LocalHospital } from "@mui/icons-material";

// Place your image in /public/clipboard.jpg
const loginImage = "/clipboard.jpg";

const Login = () => {
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  // renamed to avoid shadowing with Formik's handleSubmit
  const handleLoginSubmit = async (values) => {
    setIsSubmitting(true);
    setError("");

    try {
      const data = await loginAPI(values.username, values.password);

      if (!data?.token) {
        throw new Error("Authentication failed: No token received");
      }

      await authLogin(data.token, data.user);

      toast.success(`Welcome back, ${data.user?.username || values.username}!`);

      const role = data.user?.role;
      if (role === "admin") navigate("/admin");
      else if (role === "doctor") navigate("/doctor");
      else if (role === "receptionist") navigate("/receptionist");
      else navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err?.message || "Login failed. Please check your credentials.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      {/* Left side with full background image + subtle vertical gradient (Option 3) */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "block" },
          backgroundImage: `url(${loginImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          // tiny boost to image visibility without changing the image file
          filter: "brightness(1.03) contrast(1.02)",
        }}
      >
        {/* Subtle gradient overlay (Option 3) */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: "linear-gradient(to bottom, rgba(0,0,0,0.06), rgba(0,0,0,0.18))",
          }}
        />

        {/* Small branding text placed on top of the image (non-interactive) */}
        <Typography
          variant="h4"
          sx={{
            color: "white",
            fontWeight: "700",
            position: "absolute",
            bottom: 40,
            left: 40,
            pointerEvents: "none",
            textShadow: "0 2px 8px rgba(0,0,0,0.45)",
          }}
        >
          Masaka Hospital
        </Typography>
      </Box>

      {/* Right side with login form */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f5eee7",
          p: 2,
        }}
      >
        <Container maxWidth="sm">
          <ToastContainer position="top-right" autoClose={5000} />
          <Paper
            elevation={8}
            sx={{
              p: 4,
              borderRadius: 3,
              textAlign: "center",
              transition: "0.3s",
              "&:hover": { boxShadow: 12 },
            }}
          >
            <LocalHospital color="primary" sx={{ fontSize: 48, mb: 1 }} />

            <Typography variant="h5" fontWeight="700" gutterBottom>
              Welcome Back
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Masaka Hospital Bed & Patient Allocation System
            </Typography>

            {error && (
              <Typography color="error" align="center" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}

            <Formik
              initialValues={{ username: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={handleLoginSubmit}
            >
              {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                  <Box sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Username"
                      name="username"
                      value={values.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.username && Boolean(errors.username)}
                      helperText={touched.username && errors.username}
                      disabled={isSubmitting}
                      InputProps={{ sx: { backgroundColor: "white", borderRadius: 1 } }}
                    />
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <TextField
                      fullWidth
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                      disabled={isSubmitting}
                      InputProps={{
                        sx: { backgroundColor: "white", borderRadius: 1 },
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    sx={{
                      height: "48px",
                      background: "linear-gradient(to right, #2563eb, #059669)",
                      "&:hover": {
                        background: "linear-gradient(to right, #1d4ed8, #047857)",
                      },
                    }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
                  </Button>
                </form>
              )}
            </Formik>

            <Box sx={{ mt: 2 }}>
              <Button
                onClick={() => navigate("/register")}
                disabled={isSubmitting}
                sx={{ color: "#2563eb", textTransform: "none" }}
              >
                Don&apos;t have an account? Register
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default Login;
