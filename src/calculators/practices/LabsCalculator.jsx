import React, { useState, useEffect, Fragment } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import CustomTextField from '../../helpers/CustomTextField';

export default function LabsCalculator(props) {
    const [activityName, setActivityName] = useState("");
    const [sessionQuantity, setSessionQuantity] = useState(1);
    const [sessionPrepHours, setSessionPrepHours] = useState(1);
    const [sessionLength, setSessionLength] = useState(1);
    const [postSessionHours, setPostSessionHours] = useState(1);

    useEffect(() => {
        props.update_s_weeklyHours(0);
        props.update_s_termHours(0);
        props.update_a_weeklyHours(0);
        props.update_a_termHours(0);

        let sTermHours = sessionQuantity * sessionLength;
        let aTermHours = (sessionQuantity * sessionPrepHours) + (sessionQuantity * postSessionHours);

        props.update_s_termHours(sTermHours);
        props.update_a_termHours(aTermHours);
        props.updateActivityName(activityName);
        props.reportInputDetails?.({
            'Activity Name (Optional)': activityName,
            'Number of Sessions Scheduled per Course': sessionQuantity,
            'Preparation Time per Session (Hours)': sessionPrepHours,
            'Scheduled Session Length (Hours)': sessionLength,
            'Post-Activity Reporting Time per Session (Hrs)': postSessionHours,
        });
    }, [activityName, sessionQuantity, sessionPrepHours, sessionLength, postSessionHours]);

    return (
        <Fragment>
            <CustomTextField fieldLabel="Activity Name (Optional)" defaultState={""} updateState={setActivityName} />
            <CustomTextField fieldLabel="Number of Sessions Scheduled per Course" defaultState={1} updateState={setSessionQuantity} fieldType="number" slotProps={{ htmlInput: { min: 0 }, input: { endAdornment: <InputAdornment position="end">/course</InputAdornment> } }} />
            <CustomTextField fieldLabel="Preparation Time per Session (Hours)" defaultState={1} updateState={setSessionPrepHours} fieldType="number" slotProps={{ htmlInput: { min: 0 }, input: { endAdornment: <InputAdornment position="end">hours</InputAdornment> } }} collapseContent={<p>Preparation Time is asynchronous time when the student is expected to complete scheduled learning outside of scheduled synchronous time, in preparation for the practice-oriented experiential learning activity. </p>} />
            <CustomTextField fieldLabel="Scheduled Session Length (Hours)" defaultState={1} updateState={setSessionLength} fieldType="number" slotProps={{ htmlInput: { min: 0 }, input: { endAdornment: <InputAdornment position="end">hours</InputAdornment> } }} collapseContent={<p>Scheduled Session is synchronous time that is in-person and/or online which students are expected to attend.</p>} />
            <CustomTextField fieldLabel="Post-Activity Reporting Time per Session (Hrs)" defaultState={1} updateState={setPostSessionHours} fieldType="number" slotProps={{ htmlInput: { min: 0 }, input: { endAdornment: <InputAdornment position="end">hours</InputAdornment> } }} collapseContent={<p>Post-Activity Reflection/Reporting Time is asynchronous time when the student is expected to complete scheduled learning outside of scheduled synchronous time. </p>} />
        </Fragment>
    );
}
