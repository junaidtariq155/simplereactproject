import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Container } from '@mui/material'
import axios from 'axios';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from 'moment';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import API_KEY from '../config';

export default function ZipCode() {
  // States
  const [zipCode, setZipCode] = useState("");
  const [value, setValue] = useState("")
  const [graph, setGraph] = useState([])

  const Submit = () => {
    console.log("Date", value)
    let date = moment(value.$d).format('YYYY-MM-DD');
    console.log(date, "Date")

    axios.get(`https://www.airnowapi.org/aq/forecast/zipCode/?format=application/json&zipCode=${zipCode}&date=${date}&distance=25&API_KEY=${API_KEY}`)
      .then(function (response) {
        console.log(response);
        if (response.data.length > 0) {
          setGraph([...response.data])
        }

      }).catch(function (error) {
        console.log(error)
      })
  }

  return (
    <Container>
      <Box
        component="form"
        sx={{
          '& > :not(style)': { m: 1, width: '50ch' },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField id="zipcode" label="ZipCode" variant="outlined" onChange={(e) => {
          setZipCode(e.target.value)
        }} />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date"
            format="YYYY-MM-DD"
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>

      </Box>
      <Button variant="contained" onClick={Submit}>
        Search
      </Button>
      {
        graph && <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>DateIssue</TableCell>
                <TableCell align="center">AQI</TableCell>
                <TableCell align="center">ActionDay</TableCell>
                <TableCell align="center">Category</TableCell>
                <TableCell align="center">DateForecast</TableCell>
                <TableCell align="center">Discussion</TableCell>
                <TableCell align="center" >Latitude</TableCell>
                <TableCell align="center">Longitude</TableCell>
                <TableCell align="center">ParameterName</TableCell>
                <TableCell align="center">ReportingArea</TableCell>
                <TableCell align="center">StateCode</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {graph.map((row) => (
                <TableRow
                  key={row.DateIssue}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.DateIssue}
                  </TableCell>
                  <TableCell align="right">{row.AQI}</TableCell>
                  <TableCell align="right">{row.ActionDay}</TableCell>
                  <TableCell align="right">{row.Category.Name}</TableCell>
                  <TableCell align="right">{row.DateForecast}</TableCell>
                  <TableCell align="right">{row.Discussion}</TableCell>
                  <TableCell align="right">{row.Latitude}</TableCell>
                  <TableCell align="right">{row.Longitude}</TableCell>
                  <TableCell align="right">{row.ParameterName}</TableCell>
                  <TableCell align="right">{row.ReportingArea}</TableCell>
                  <TableCell align="right">{row.StateCode}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      }
    </Container>

  );
}