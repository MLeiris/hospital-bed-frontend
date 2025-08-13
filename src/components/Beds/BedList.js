import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';

const BedList = ({ beds }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Bed Number</TableCell>
            <TableCell>Ward</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {beds.map((bed) => (
            <TableRow key={bed.id}>
              <TableCell>{bed.bed_number}</TableCell>
              <TableCell>{bed.ward_name}</TableCell>
              <TableCell>
                <Chip 
                  label={bed.status} 
                  color={bed.status === 'available' ? 'success' : 'error'} 
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BedList;