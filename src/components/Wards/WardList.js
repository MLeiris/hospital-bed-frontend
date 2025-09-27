import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import WardGauge from './WardGauge';

const WardList = ({ wards }) => (
  <TableContainer component={Paper} sx={{ mt: 2 }}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Capacity</TableCell>
          <TableCell>Occupied</TableCell>
          <TableCell>Available</TableCell>
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
              <WardGauge
                wardName={ward.name}
                capacity={ward.capacity}
                occupied={ward.occupied_beds}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default WardList;