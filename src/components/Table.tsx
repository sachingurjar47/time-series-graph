import * as React from "react";
import MuiTable from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box, TableContainer } from "@mui/material";
import "./table.css";
function createData(
  reason: string,
  message: string,
  involvedObject: string,
  count: number,
  lastOccurred: Date
) {
  return { reason, message, involvedObject, count, lastOccurred };
}

const rows = new Array(5)
  .fill(0)
  ?.map((_, i) =>
    createData(
      `Reason ${i + 1}`,
      `Message ${i + 1}`,
      `Involved Object :New ${i + 1}`,
      i + 1,
      new Date()
    )
  );

const Table: React.FC = () => {
  return (
    <Box sx={{ padding: "1rem" }}>
      <TableContainer sx={{ maxHeight: 440, overflow: "auto" }}>
        <MuiTable aria-label="simple table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>REASON</TableCell>
              <TableCell align="right">MESSAGE</TableCell>
              <TableCell align="right">INVOLVED OBJECT</TableCell>
              <TableCell align="right">COUNT</TableCell>
              <TableCell align="right">LAST OCCURRED</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.reason}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{row.reason}</TableCell>
                <TableCell align="right">{row.message}</TableCell>
                <TableCell align="right">{row.involvedObject}</TableCell>
                <TableCell align="right">{row.count}</TableCell>
                <TableCell align="right">
                  {row.lastOccurred.toISOString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </MuiTable>
      </TableContainer>
    </Box>
  );
};

export default Table;
