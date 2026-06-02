import React, { useState, useEffect, Fragment } from 'react';
import CustomTextField from '../../helpers/CustomTextField';
import InputAdornment from '@mui/material/InputAdornment';

export default function ClinicalCalculator(props) {
    const [activityName, setActivityName] = useState("");
    const [weeksQuantity, setWeeksQuantity] = useState(1);
    const [hoursPerDay, setHoursPerDay] = useState(1);
    const [postActivityHours, setPostActivityHours] = useState(1);

    useEffect(() => {
        props.update_s_weeklyHours(0);
        props.update_s_termHours(0);
        props.update_a_weeklyHours(0);
        props.update_a_termHours(0);

        let sTermHours = hoursPerDay * 7 * weeksQuantity;
        let aTermHours = postActivityHours * weeksQuantity;

        props.update_s_termHours(sTermHours);
        props.update_a_termHours(aTermHours);
        props.updateActivityName(activityName);
        props.reportInputDetails?.({
            'Activity Name (Optional)': activityName,
            'Number of Scheduled Weeks': weeksQuantity,
            'Number of Scheduled hours per Day': hoursPerDay,
            'Post-Activity Reporting Time per Week (Hrs)': postActivityHours,
        });
    }, [activityName, weeksQuantity, hoursPerDay, postActivityHours]);

    return (
        <Fragment>
            <CustomTextField fieldLabel="Activity Name (Optional)" defaultState={""} updateState={setActivityName} />
            <CustomTextField fieldLabel="Number of Scheduled Weeks" defaultState={1} updateState={setWeeksQuantity} fieldType="number" slotProps={{ htmlInput: { min: 0 }, input: { endAdornment: <InputAdornment position="end">weeks</InputAdornment> } }} collapseContent={<p>Scheduled Weeks are the number of weeks students are expected to complete during the length of the course. This time is counted as synchronous time and can be in-person and/or online.</p>} />
            <CustomTextField fieldLabel="Number of Scheduled hours per Day" defaultState={1} updateState={setHoursPerDay} fieldType="number" slotProps={{ htmlInput: { min: 0 }, input: { endAdornment: <InputAdornment position="end">hours/day</InputAdornment> } }} collapseContent={<p>Scheduled Hours per Day are the number of hours each day students are expected to complete. This time is counted as synchronous time and can be in-person and/or online.</p>} />
            <CustomTextField fieldLabel="Post-Activity Reporting Time per Week (Hrs)" defaultState={1} updateState={setPostActivityHours} fieldType="number" slotProps={{ htmlInput: { min: 0 }, input: { endAdornment: <InputAdornment position="end">hours</InputAdornment> } }} collapseContent={<p>Post-Activity Reflection/Reporting Time is asynchronous time where the student is expected to complete scheduled learning outside of scheduled synchronous time.</p>} />
        </Fragment>
    );
}
