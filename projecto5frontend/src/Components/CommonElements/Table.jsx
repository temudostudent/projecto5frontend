import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu'
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}



function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, headCells, dataType, typeOfUser } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>

      {(typeOfUser === 300) && (
        <>
            <TableCell padding="checkbox">
              <Checkbox
                color="primary"
                indeterminate={numSelected > 0 && numSelected < rowCount}
                checked={rowCount > 0 && numSelected === rowCount}
                onChange={onSelectAllClick}
                inputProps={{
                  'aria-label': 'select all',
                }}
              />
            </TableCell>
            {dataType === "Users" && (
              <TableCell>
                {/*Vazia*/}
              </TableCell>
            )}          
 
        </>
      )}

        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            //padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { dataType, typeOfUser, numSelected, onDeleteSelected, selected, setSelected, onEditSelect, filterData, handleFilter, onChangeVisibilitySelect, onPermDeleteSelect} = props;
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDelete = () => {
    onDeleteSelected();
    setSelected([]);
  };

  const handleEdit = () => {
    onEditSelect();
    setSelected([]);
  };

  const handleVisibility = () => {
    onChangeVisibilitySelect();
    setSelected([]);
  };

  const handlePermDelete = () => {
    onPermDeleteSelect();
    setSelected([]);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };


  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {dataType}
        </Typography>
      )}

      {numSelected === 1 ? (
        <Tooltip>
        <div className='table-buttons-container'>

        {(typeOfUser === 200) && (
            <>
              <IconButton title="Edit" onClick={dataType === "Users" ? handleEdit : null}>
                <VisibilityIcon />
              </IconButton>
            </>
          )}




          {(typeOfUser === 300) && (
            <>
              <IconButton title="Edit" onClick={dataType === "Users" ? handleEdit : handleEdit}>
                <EditIcon />
              </IconButton>
              <IconButton 
                title={dataType === "Users" ? "Delete Tasks" : "Delete"} 
                onClick={handleDelete}
              >
                <DeleteIcon />
              </IconButton>
              {dataType === "Users" && (
                <IconButton title="Reverse Current Visibility" onClick={handleVisibility}>
                  <ChangeCircleIcon/>
                </IconButton>
              )}
              {!selected[0].visible && dataType === "Users" && (
                <IconButton title="Permanently Delete"  onClick={handlePermDelete}>
                  <DeleteForeverIcon />
                </IconButton>
              )}
            </>
          )}
        </div>
      </Tooltip>
      ) : numSelected > 1 ? (
        <Tooltip>
          <div className='table-buttons-container'>
          {(typeOfUser === 300) && (
            <>
            <IconButton 
                title={dataType === "Users" ? "Delete Tasks" : "Delete"}
                onClick={handleDelete}
              >
              <DeleteIcon />
            </IconButton>
            {dataType === "Users" && (
            <IconButton title="Reverse Current Visibility" onClick={handleVisibility}>
              <ChangeCircleIcon/>
            </IconButton>
            )}
            </>
          )}
          </div>
        </Tooltip>

      ) : (
        <Tooltip title="Filter list">
          <IconButton onClick={handleMenuOpen}>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
      {filterData && (
        <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {filterData.map((option) => (
          <MenuItem key={option.id} onClick={() => handleFilter(option.id)}>
            {option.label}
          </MenuItem>
      ))}
      </Menu>
      )}
    
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  setSelected: PropTypes.func.isRequired,
};

export default function EnhancedTable(props) {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('number_tasks');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const { dataType, data, typeOfUser, onSelectionChange, onDeleteSelected, onAddChange, onEditSelect, headCells, filterData, handleFilter, onChangeVisibilitySelect, onPermDeleteSelect } = props;

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);

    onSelectionChange(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(data, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [data, order, orderBy, page, rowsPerPage],
  );

    return( 
    <Box sx={{ width: '80%' }}>
    <Paper sx={{ width: '100%', mb: 2 }}>
      <EnhancedTableToolbar 
        dataType={dataType}
        selected={selected}
        numSelected={selected.length} 
        typeOfUser={typeOfUser}
        onDeleteSelected={onDeleteSelected}
        onEditSelect={onEditSelect}
        filterData={filterData}
        setSelected={setSelected}
        handleFilter={handleFilter}
        onChangeVisibilitySelect={onChangeVisibilitySelect}
        onPermDeleteSelect={onPermDeleteSelect}
      />
      <TableContainer>
        <Table
          sx={{ minWidth: 600 }}
          aria-labelledby="tableTitle"
          className="table"
        >
          <EnhancedTableHead
            dataType={dataType}
            typeOfUser={typeOfUser}
            headCells={headCells}
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={data.length}
          />
          <TableBody>
            {visibleRows.map((row, index) => {
              const isItemSelected = isSelected(row.id);
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow
                  key={row.id}
                  hover
                  onClick={(event) => {
                    console.log("Clicked row:", row.id);
                    handleClick(event, row.id);
                  }}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  selected={isItemSelected}
                  sx={{ cursor: 'pointer' }}
                >

                {(typeOfUser === 300) && (
                    <>
                      {/* Coluna para a checkbox */}
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      
                      {/* Coluna de visibilidade */}
                      {(dataType === "Users") && (
                        <TableCell style={{ padding: "4px 4px 0" }}>
                        {row.visible ? 
                          <VisibilityOutlinedIcon color="primary" /> :
                          <VisibilityOffOutlinedIcon color="primary" />
                        }
                      </TableCell>
                      )}
                    </>
                  )}

                  {headCells.map((headCell) => (
                      <TableCell
                          key={headCell.id}
                          align={headCell.numeric ? 'right' : 'left'}
                          //padding={headCell.disablePadding ? 'none' : 'normal'}
                      >
                          {headCell.id === 'photoURL' ? (
                              <img src={row[headCell.id]} alt="Profile Pic" style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover'}} />
                          ) : (
                              row[headCell.id]
                          )}
                      </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer> 
      <div className='bottom-table-container'>
        {dataType === "Categories" && (
            <div className='add-category-button-container'>
              <button onClick={onAddChange}>+ Category</button>
            </div>
          )}
        <TablePagination
          rowsPerPageOptions={[5]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </Paper>
  </Box>
);
            
}