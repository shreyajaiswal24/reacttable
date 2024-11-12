import * as React from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { useEffect, useState } from "react";
import TableHead from '@mui/material/TableHead';
import { Modal, TextField, Button } from "@mui/material";


function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

// function createData(name, calories, fat) {
//   return { name, calories, fat };
// }

// const rows = [
//   createData("Cupcake", 305, 3.7),
//   createData("Donut", 452, 25.0),
//   createData("Eclair", 262, 16.0),
//   createData("Frozen yoghurt", 159, 6.0),
//   createData("Gingerbread", 356, 16.0),
//   createData("Honeycomb", 408, 3.2),
//   createData("Ice cream sandwich", 237, 9.0),
//   createData("Jelly Bean", 375, 0.0),
//   createData("KitKat", 518, 26.0),
//   createData("Lollipop", 392, 0.2),
//   createData("Marshmallow", 318, 0),
//   createData("Nougat", 360, 19.0),
//   createData("Oreo", 437, 18.0),
// ].sort((a, b) => (a.calories < b.calories ? -1 : 1));



export default function CustomPaginationActionsTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [data, setData] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [userData, setUserData] = useState({
    Name: "",
    Address: "",
    DOB: "",
    Enrollment_Date: "",
    Role: "",
    Location: ""
  });

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  //CRUD OPERATION
  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://api.airtable.com/v0/appPfrIrFOhFwopbH/Sheet1`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${"patymCZ9PjW4GomAD.bfd5bd9d1d50b3784b56e5e552392ff0559751bd78ac1840ba281619d8e0647e"}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      // Check if the response is okay (status 200)
      if (!response.ok) {
        throw new Error("Failed to fetch data from Airtable");
      }
      
      const result = await response.json();
      console.log(result);
      console.log(result.records);

      // Set the data from Airtable
      setData(result.records);

      console.log(data);
    } catch (err) {
      console.log(err);
      // Handle errors (e.g., API errors or network errors)
    }
  };
  useEffect(() => {
    fetchData();
    console.log(data)
  }, []);

  const handleAdd = () => {
    setUserData({ Name: "", Address: "", DOB: "", Enrollment_Date: "", Role: "", Location: "" });
    setIsEditMode(false);
    setOpenModal(true);
  };

  const handleEdit = (item) => {
    setUserData(item.fields);
    setIsEditMode(true);
    setOpenModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check if it's an edit or add operation
    if (isEditMode) {
      try {
        const response = await fetch(`https://api.airtable.com/v0/appPfrIrFOhFwopbH/Sheet1`, {
          method: "UPDATE",
          headers: {
            Authorization: `Bearer ${"patymCZ9PjW4GomAD.bfd5bd9d1d50b3784b56e5e552392ff0559751bd78ac1840ba281619d8e0647e"}`,  // Ensure the API key is correct
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fields: userData,
          }),
        });
  
        // Handle the response after successful PATCH
        if (response.ok) {
          const updatedUser = await response.json();
          console.log(updatedUser)
          // Update the local data state
          setData(prevData =>
            prevData.map(d => (d.id === updatedUser.id ? { ...d, fields: updatedUser.fields } : d))
          );
          console.log(data)
          setOpenModal(false);
        } else {
          console.log("Failed to update user");
        }
      } catch (error) {
        console.error("Failed to update user:", error);
      }
    } else {
      // Add new user
      try {
        const response = await fetch("https://api.airtable.com/v0/appPfrIrFOhFwopbH/Sheet1", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${"patymCZ9PjW4GomAD.bfd5bd9d1d50b3784b56e5e552392ff0559751bd78ac1840ba281619d8e0647e"}`, 
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fields: userData }),
        });
        if (response.ok) {
          const newUser = await response.json();
          setData(prevData => [...prevData, newUser]);
          setOpenModal(false);
        }
      } catch (error) {
        console.error("Failed to add new user:", error);
      }
    }
  };
  

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
      <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Address</TableCell>
            <TableCell align="right">DOB</TableCell>
            <TableCell align="right">Enrollment Date</TableCell>
            <TableCell align="right">Role</TableCell>
            <TableCell align="right">Location</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>

          {data &&
            (rowsPerPage > 0
              ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : data
            ).map((item) => (
              <TableRow key={item.id}>
                <TableCell component="th" scope="row">
                  {item.fields.Name}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {item.fields.Address}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {item.fields.DOB}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {item.fields.Enrollment_Date}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {item.fields.Role}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {item.fields.Location}
                </TableCell> 
                <TableCell align="right">
                <Button onClick={() => handleEdit(item)}>Edit</Button> {/* Edit button */}
                </TableCell>
              </TableRow>
            ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
              colSpan={3}
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              slotProps={{
                select: {
                  inputProps: {
                    "aria-label": "rows per page",
                  },
                  native: true,
                },
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={{ padding: 4, width: 400, margin: 'auto', top: '50%', transform: 'translateY(-50%)', position: 'absolute' }}>
          <h2>{isEditMode ? "Edit User" : "Add User"}</h2>
          <form onSubmit={handleSubmit}>
            <TextField label="Name" value={userData.Name} onChange={e => setUserData({ ...userData, Name: e.target.value })} fullWidth />
            <TextField label="Address" value={userData.Address} onChange={e => setUserData({ ...userData, Address: e.target.value })} fullWidth />
            <TextField label="DOB" value={userData.DOB} onChange={e => setUserData({ ...userData, DOB: e.target.value })} fullWidth />
            <TextField label="Enrollment Date" value={userData.Enrollment_Date} onChange={e => setUserData({ ...userData, Enrollment_Date: e.target.value })} fullWidth />
            <TextField label="Role" value={userData.Role} onChange={e => setUserData({ ...userData, Role: e.target.value })} fullWidth />
            <TextField label="Location" value={userData.Location} onChange={e => setUserData({ ...userData, Location: e.target.value })} fullWidth />
            <Button type="submit" variant="contained" color="primary">{isEditMode ? "Update" : "Add"}</Button>
          </form>
        </Box>
        </Modal>
    </TableContainer>
  );
}
