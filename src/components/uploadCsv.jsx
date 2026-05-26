import React, { useState, useRef, Fragment } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CSVReader from 'react-csv-reader';
import { useTrackEvent } from '../analytics/AnalyticsContext';

function UploadCsv(props) {
    const trackEvent = useTrackEvent();
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const csvReaderRef = useRef(null);

    const handleUploadClickOpen = () => {
        setUploadDialogOpen(true);
    };

    const handleUploadClose = () => {
        setUploadDialogOpen(false);
    };

    const handleYes = () => {
        setUploadDialogOpen(false);
        csvReaderRef.current.click();
    };

    const handleNo = () => {
        setUploadDialogOpen(false);
    };

    const handleErrorDialogClose = () => {
        setErrorDialogOpen(false);
    };

    const handleError = (error) => {
        setErrorMessage(error.message);
        setErrorDialogOpen(true);
    };

    const handleCsvReader = (data, fileInfo) => {
        const expectedHeaders = [
            "id",
            'Component',
            'Activity',
            'Activity Name',
            'hours/week (S)',
            'hours/term (S)',
            'hours/week (A)',
            'hours/term (A)'
        ];

        const isValidNumber = (n) => !isNaN(parseFloat(n)) && isFinite(n);
        const isValidString = (s) => typeof s === 'string' && s.trim() !== '';
        const isValidOrEmptyString = (s) => typeof s === 'string';

        function isTotalRow(row) {
            return row.slice(0, 4).every(cell => cell === 'TOTAL');
        }

        function removeEmptyRows(dataArray) {
            while (dataArray.length > 0 && dataArray[dataArray.length - 1].every(cell => cell === '')) {
                dataArray.pop();
            }
            return dataArray;
        }

        data = removeEmptyRows(data);

        function validateDataArray(dataArray) {
            if (!Array.isArray(dataArray) || dataArray.length === 0) {
                return false;
            }

            const headers = dataArray[0];
            if (JSON.stringify(headers) !== JSON.stringify(expectedHeaders)) {
                return false;
            }

            for (let i = 1; i < dataArray.length; i++) {
                const row = dataArray[i];
                const isLastRow = i === dataArray.length - 1;

                if (isTotalRow(row)) {
                    if (!isLastRow) return false;
                    continue;
                }

                if (
                    !isValidNumber(row[0]) ||
                    !isValidString(row[1]) ||
                    !isValidString(row[2]) ||
                    !isValidOrEmptyString(row[3]) ||
                    !isValidNumber(row[4]) ||
                    !isValidNumber(row[5]) ||
                    !isValidNumber(row[6]) ||
                    !isValidNumber(row[7])
                ) {
                    return false;
                }
            }
            return true;
        }

        if (validateDataArray(data)) {
            const keys = data[0];
            const values = data.slice(1);

            if (values.length && isTotalRow(values[values.length - 1])) {
                values.pop();
            }

            const formattedData = values.map((row) => {
                const obj = {};
                keys.forEach((key, index) => {
                    obj[key] = isNaN(row[index]) ? row[index] : parseFloat(row[index]);
                });
                return obj;
            });

            props.updateSummary(JSON.stringify(formattedData));
            trackEvent('csv_uploaded', { row_count: formattedData.length });
        } else {
            handleError(new Error("The CSV file has invalid data. Please check the format and try again."));
        }
    };

    return (
        <Fragment>
            <Button sx={{ m: 1 }} variant="outlined" size="large" onClick={handleUploadClickOpen}>
                Upload CSV
            </Button>

            {/* Upload Confirmation Dialog */}
            <Dialog
                open={uploadDialogOpen}
                onClose={handleUploadClose}
                aria-labelledby="upload-dialog-title"
            >
                <DialogTitle id="upload-dialog-title">Upload CSV File</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This will replace all the existing data in the table. Are you sure you want to continue?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleYes} autoFocus>Yes</Button>
                    <Button variant="outlined" onClick={handleNo}>No</Button>
                </DialogActions>
            </Dialog>

            {/* Error Dialog */}
            <Dialog
                open={errorDialogOpen}
                onClose={handleErrorDialogClose}
                aria-labelledby="error-dialog-title"
            >
                <DialogTitle id="error-dialog-title">Error</DialogTitle>
                <DialogContent>
                    <DialogContentText id="error-dialog-description">
                        {errorMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleErrorDialogClose}>OK</Button>
                </DialogActions>
            </Dialog>

            <CSVReader
                onFileLoaded={handleCsvReader}
                inputStyle={{ display: 'none' }}
                ref={csvReaderRef}
            />
        </Fragment>
    );
}

export default UploadCsv;
