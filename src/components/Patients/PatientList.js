import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Chip } from '@mui/material';
import { dischargePatient } from '../../api/patients';
import { toast } from 'react-toastify';

const PatientList = ({ patients, showDischargeAction = false, onDischarge }) => {
  const handleDischarge = async (patientId) => {
    try {
      await dischargePatient(patientId);
      toast.success('Patient discharged successfully');
      if (onDischarge) {
        onDischarge(patientId);
      }
    } catch (error) {
      console.error('Discharge API Error:', error);
      toast.error(error.response?.data?.error || 'Discharge failed. Check console for details.');
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Age</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Condition</TableCell>
            <TableCell>Ward</TableCell>
            <TableCell>Bed</TableCell>
            <TableCell>Status</TableCell>
            {showDischargeAction && <TableCell>Action</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell>{patient.name}</TableCell>
              <TableCell>{patient.age}</TableCell>
              <TableCell>{patient.gender}</TableCell>
              <TableCell>{patient.medical_condition}</TableCell>
              <TableCell>{patient.ward_name || 'N/A'}</TableCell>
              <TableCell>{patient.bed_number || 'N/A'}</TableCell>
              <TableCell>
                <Chip
                  label={patient.discharged ? 'Discharged' : 'Admitted'}
                  color={patient.discharged ? 'default' : 'primary'}
                />
              </TableCell>
              {showDischargeAction && !patient.discharged && (
                <TableCell>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDischarge(patient.id)}
                  >
                    Discharge
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PatientList;