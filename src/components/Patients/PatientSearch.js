import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Box,
} from "@mui/material";

const PatientSearch = () => {
  const [name, setName] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const { token } = useAuth();

  const handleSearch = async () => {
    if (!name) return;
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/receptionist/patients/search?name=${name}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPatients(response.data.data);
    } catch (err) {
      if (
        err.response &&
        typeof err.response.data === "string" &&
        err.response.data.startsWith("<!DOCTYPE")
      ) {
        setError("API returned HTML instead of JSON. Check your backend route and response.");
      } else {
        setError("Failed to fetch patients.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h5" gutterBottom>
        Search Patients
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          label="Patient Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          variant="outlined"
          fullWidth
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Search"}
        </Button>
      </Box>

      {error && <Typography color="error">{error}</Typography>}

      {patients.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Medical Condition</TableCell>
                <TableCell>Ward</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.id}</TableCell>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell>{patient.gender}</TableCell>
                  <TableCell>{patient.medical_condition}</TableCell>
                  <TableCell>{patient.ward_name || patient.ward}</TableCell>
                  <TableCell>
                    {patient.discharged === 1 ? "Discharged" : "Admitted"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {searched && patients.length === 0 && !loading && !error && (
        <Typography>No patients found.</Typography>
      )}
    </Box>
  );
};

export default PatientSearch;
