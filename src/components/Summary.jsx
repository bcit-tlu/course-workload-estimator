import React, { useMemo, useCallback, useRef, useState, Fragment } from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import Button from '@mui/material/Button';
import { red } from '@mui/material/colors';
import DeleteIcon from '@mui/icons-material/Delete';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import components from '../helpers/components';
import UploadCsv from './uploadCsv';
import { useTrackEvent } from '../analytics/AnalyticsContext';

export default function Summary(props) {
    const trackEvent = useTrackEvent();
    let colors = {};
    let componentColors = ['#77dd77', '#aec6cf', '#ffd1dc', '#b39eb5', '#FDE541', '#ffb347', '#ff6961'];

    Object.keys(components).map((component, index) => {
        colors[component] = componentColors[index];
    });

    const boxStyle = {
        padding: '1em 0',
        borderRadius: '5px',
        margin: '0.5em 0',
        display: 'inline-block',
        width: '100%'
    };

    const roundNumber = (num) => {
        return Math.round((num + Number.EPSILON) * 100) / 100;
    };

    const formatTime = (hours) => {
        let hoursTime = Math.floor(hours);
        let decimals = hours - Math.floor(hoursTime);
        let minutesTime = Math.round(decimals * 60);

        let delimiter = '';
        if (hoursTime > 0) {
            if (minutesTime > 0) {
                delimiter = ' ';
            }
        }
        let formattedTime = `${hoursTime > 0 ? hoursTime + 'h' + delimiter : ''}${minutesTime > 0 ? minutesTime + 'm' : ''}`;
        return formattedTime;
    };

    const columns = useMemo(
        () => [
            { field: 'id', headerName: '#', headerAlign: 'center', align: 'center', flex: 0.5 },
            { field: 'Component', headerName: 'Component', headerAlign: 'center' },
            { field: 'Activity', headerName: 'Activity', headerAlign: 'center' },
            { field: 'Activity Name', headerName: 'Activity Name', headerAlign: 'center', flex: 2 },
            {
                field: 'hours/week (S)', headerName: 'hours /week (S)', renderHeader: () => (<span className='summary-table-header'>hours<wbr />/week (S)</span>), headerAlign: 'center', align: 'center', flex: 1,
                valueFormatter: (value) => formatTime(value)
            },
            {
                field: 'hours/term (S)', headerName: 'hours /term (S)', renderHeader: () => (<span className='summary-table-header'>hours<wbr />/term (S)</span>), headerAlign: 'center', align: 'center', flex: 1,
                valueFormatter: (value) => formatTime(value)
            },
            {
                field: 'hours/week (A)', headerName: 'hours /week (A)', renderHeader: () => (<span className='summary-table-header'>hours<wbr />/week (A)</span>), headerAlign: 'center', align: 'center', flex: 1,
                valueFormatter: (value) => formatTime(value)
            },
            {
                field: 'hours/term (A)', headerName: 'hours /term (A)', renderHeader: () => (<span className='summary-table-header'>hours<wbr />/term (A)</span>), headerAlign: 'center', align: 'center', flex: 1,
                valueFormatter: (value) => formatTime(value)
            },
            {
                field: 'actions', type: 'actions', headerAlign: 'center', align: 'center', flex: 0.5,
                getActions: (params) => [
                    <GridActionsCellItem
                        icon={<DeleteIcon sx={{ color: red[500] }} />}
                        label="Delete"
                        onClick={deleteUser(params.id)}
                        className="no-print"
                    />
                ]
            }
        ],
        [deleteUser]);

    let jsonSummary = JSON.parse(props.summary) || [];
    let totalSWeekly = 0;
    let totalAWeekly = 0;
    let totalSTerm = 0;
    let totalATerm = 0;
    let totalWeeklyHours = 0;
    let totalTermHours = 0;

    let rows = [];
    let pieData = [];
    let containerHeight = 280;

    jsonSummary.forEach((row, index) => {
        // row['id'] = index;
        if (!row['Activity Name']) {
            row['Activity Name'] = row['Activity'];
        }

        if (props.duration > 0) {
            if (row['hours/term (S)'] != 0 && row['hours/week (S)'] == 0) {
                row['hours/week (S)'] = row['hours/term (S)'] / props.duration;
                row['hours/term (S)'] = row['hours/term (S)'];
            } else {
                row['hours/term (S)'] = row['hours/week (S)'] * props.duration;
                row['hours/week (S)'] = row['hours/week (S)'];
            }

            if (row['hours/term (A)'] != 0 && row['hours/week (A)'] == 0) {
                row['hours/week (A)'] = row['hours/term (A)'] / props.duration;
                row['hours/term (A)'] = row['hours/term (A)'];
            } else {
                row['hours/term (A)'] = row['hours/week (A)'] * props.duration;
                row['hours/week (A)'] = row['hours/week (A)'];
            }
        } else {
            row['hours/week (S)'] = 0;
            row['hours/term (S)'] = 0;
            row['hours/week (A)'] = 0;
            row['hours/term (A)'] = 0;
        }

        rows.push({ ...{ 'id': index + 1 }, ...row });


        let dataIndex = pieData.findIndex(({ name }) => name === row['Component']);
        if (dataIndex >= 0) {
            pieData[dataIndex]['value'] += row['hours/term (S)'] + row['hours/term (A)'];
        } else {
            let newData = {};
            newData['name'] = row['Component'];
            newData['value'] = row['hours/term (S)'] + row['hours/term (A)'];
            // newData['unit'] = 'hours';
            // if(newData['value']){
            pieData.push(newData);
            // };
        }

        totalSWeekly += row['hours/week (S)'];
        totalSTerm += row['hours/term (S)'];
        totalAWeekly += row['hours/week (A)'];
        totalATerm += row['hours/term (A)'];
    });

    pieData = pieData.sort((a, b) => b['value'] - a['value']);
    let extraHeight = (rows.length - pieData.length) > 0 ? (rows.length - pieData.length) : 0;
    containerHeight = containerHeight + (pieData.length * 30) + (extraHeight * 2);
    totalSWeekly = totalSWeekly;
    totalSTerm = totalSTerm;
    totalAWeekly = totalAWeekly;
    totalATerm = totalATerm;
    totalWeeklyHours = totalAWeekly + totalSWeekly;
    totalTermHours = totalATerm + totalSTerm;


    const deleteUser = useCallback(
        (id) => () => {
            setTimeout(() => {
                let newSummary = JSON.parse(localStorage.getItem('bcitcourseworkloadestimator'));
                newSummary.splice(id - 1, 1);
                props.updateSummary(JSON.stringify(newSummary));
            });
        },
        [],
    );

    let renderLabel = function (entry) {
        return `${roundNumber(entry.value / totalTermHours * 100)}%`;
    };

    const renderTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip" style={{ backgroundColor: colors[payload[0].name], padding: "1px 10px", borderRadius: "5px" }}>
                    <p className="label"><>{payload[0].name}: <strong>{formatTime(payload[0].value)}</strong> ({roundNumber(payload[0].value / totalTermHours * 100)}%)</></p>

                </div>
            );
        }
        return null;
    };

    const savePdf = () => {
        window.print();
    };

    const saveCsv = () => {
        try {
            const array = [Object.keys(rows[0])].concat(rows);
            array.push({ 'id': 'TOTAL', 'Component': 'TOTAL', 'Activity': 'TOTAL', 'Activity Name': 'TOTAL', 'hours/week (S)': totalSWeekly, 'hours/term (S)': totalSTerm, 'hours/week (A)': totalAWeekly, 'hours/term (A)': totalATerm });
            let csvString = array.map(it => {
                return Object.values(it).toString();
            }).join('\n');

            let link = document.createElement("a");
            link.download = 'course-workload.csv';
            link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvString);
            link.click();

        }
        catch (error) {
            console.error("Error in saveCsv", error);
        }
    };


    return (
        <div className='summary-table'>
            <DataGrid className='no-print' autoHeight getRowHeight={() => 'auto'} rows={rows} columns={columns} columnVisibilityModel={{ 'id': false, 'Component': false, 'Activity': false }} hideFooter={true} sx={{
                '& .MuiDataGrid-columnHeaderTitle': {
                    textOverflow: "clip",
                    whiteSpace: "normal",
                    lineHeight: 1,
                    textAlign: "center"
                },
                '& .MuiDataGrid-columnHeader, & .MuiDataGrid-filler > div, & .MuiDataGrid-scrollbarFiller': {
                    backgroundColor: 'rgb(231, 240, 255)',
                },
                '& .MuiDataGrid-cell': {
                    display: 'flex',
                    alignItems: 'center',
                },
                '& .MuiDataGrid-row:nth-of-type(even)': {
                    backgroundColor: 'rgb(0 126 255 / 5%)',
                },
                '@media print': {
                    '.MuiDataGrid-main': { width: '100%' },
                },
                '.MuiDataGrid-main': {
                    width: "auto"
                },
            }} />
            <TableContainer className='print-only' component={Paper}>
                <Table size="small" aria-label="summary table">
                    <TableHead>
                        <TableRow>
                            <TableCell align='center'><strong>Activity</strong></TableCell>
                            <TableCell align='center'><strong>hours/week<br />(S)</strong></TableCell>
                            <TableCell align='center'><strong>hours/term<br />(S)</strong></TableCell>
                            <TableCell align='center'><strong>hours/week<br />(A)</strong></TableCell>
                            <TableCell align='center'><strong>hours/term<br />(A)</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {jsonSummary.map((row, index) => (
                            <TableRow key={'summary-table-row-' + index}>
                                <TableCell>{row['Activity Name']}</TableCell>
                                <TableCell align='center'>{formatTime(row['hours/week (S)'])}</TableCell>
                                <TableCell align='center'>{formatTime(row['hours/term (S)'])}</TableCell>
                                <TableCell align='center'>{formatTime(row['hours/week (A)'])}</TableCell>
                                <TableCell align='center'>{formatTime(row['hours/term (A)'])}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {
                jsonSummary.length ?
                    <Fragment>
                        <Box className='no-print' sx={{ textAlign: 'right' }}>
                            <Button variant="outlined" color="error" size="small" sx={{ textTransform: "none" }} onClick={() => { localStorage.removeItem('bcitcourseworkloadestimator'); props.updateSummary(null); trackEvent('summary_cleared'); }}>clear all</Button>
                        </Box>
                        <Box sx={boxStyle}>
                            <TableContainer component={Paper} sx={{ width: "fit-content", margin: "0 auto" }}>
                                <Table size="small" aria-label="total hours table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align='center'><strong>Learning Type</strong></TableCell>
                                            <TableCell align='center'><strong>hours/week</strong></TableCell>
                                            <TableCell align='center'><strong>hours/term</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Synchronous (S)</TableCell>
                                            <TableCell align='center'>{formatTime(totalSWeekly)}</TableCell>
                                            <TableCell align='center'>{formatTime(totalSTerm)}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Asynchronous (A)</TableCell>
                                            <TableCell align='center'>{formatTime(totalAWeekly)}</TableCell>
                                            <TableCell align='center'>{formatTime(totalATerm)}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><strong>TOTAL</strong></TableCell>
                                            <TableCell align='center'><strong>{formatTime(totalWeeklyHours)}</strong></TableCell>
                                            <TableCell align='center'><strong>{formatTime(totalTermHours)}</strong></TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            {
                                props.duration > 0 ?
                                    <Fragment>
                                        <ResponsiveContainer width="100%" height={containerHeight}>
                                            <PieChart>
                                                <Pie
                                                    dataKey="value"
                                                    data={pieData}
                                                    isAnimationActive={true}
                                                    outerRadius={100}
                                                    fill="#8884d8"
                                                    legendType="circle"
                                                    label={renderLabel}
                                                >
                                                    {pieData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={colors[entry.name]} />
                                                    ))}
                                                </Pie>
                                                <Legend layout="vertical" verticalAlign="top" payload={
                                                    pieData.map(
                                                        (item) => ({
                                                            id: item.name,
                                                            type: "circle",
                                                            value: <>{item.name}: <strong>{formatTime(item.value)}</strong> ({roundNumber(item.value / totalTermHours * 100)}%)</>,
                                                            color: colors[item.name]
                                                        })
                                                    )
                                                } />
                                                <Tooltip content={renderTooltip} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </Fragment> : null
                            }
                        </Box>

                    </Fragment> : null
            }
            <Box className='no-print' sx={{ textAlign: 'center' }}>
                <UploadCsv updateSummary={props.updateSummary} />
                {
                    jsonSummary.length ?
                        <Fragment>
                            <Button sx={{ m: 1 }} variant="outlined" size="large" onClick={saveCsv}>Save as CSV</Button>
                            <Button sx={{ m: 1 }} variant="contained" size="large" onClick={savePdf}>Save as PDF</Button>
                        </Fragment>
                        : null
                }
            </Box>
        </div>
    );
};
