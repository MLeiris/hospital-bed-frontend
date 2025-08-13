import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const WardList = ({ wards }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Ward Name</TableCell>
            <TableCell>Capacity</TableCell>
            <TableCell>Occupied Beds</TableCell>
            <TableCell>Available Beds</TableCell>
            <TableCell>Utilization</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {wards.map((ward) => (
            <TableRow key={ward.id}>
              <TableCell>{ward.name}</TableCell>
              <TableCell>{ward.capacity}</TableCell>
              <TableCell>{ward.occupied_beds}</TableCell>
              <TableCell>{ward.available_beds}</TableCell>
              <TableCell>
                {Math.round((ward.occupied_beds / ward.capacity) * 100)}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default WardList;