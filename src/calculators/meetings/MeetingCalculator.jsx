import React, { useState, useEffect, Fragment } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import CustomTextField from '../../helpers/CustomTextField';

export default function MeetingCalculator(props) {
    const [activityName, setActivityName] = useState("");
    const [meetingQuantity, setMeetingQuantity] = useState(1);
    const [meetingLength, setMeetingLength] = useState(1);
    const meetingType = props.meetingType;


    useEffect(() => {
        props.update_s_weeklyHours(0);
        props.update_s_termHours(0);
        props.update_a_weeklyHours(0);
        props.update_a_termHours(0);

        if (meetingType == "week") {
            let sWeeklyHours = meetingQuantity * meetingLength;
            props.update_s_weeklyHours(sWeeklyHours);
        } else {
            let sTermHours = meetingQuantity * meetingLength;
            props.update_s_termHours(sTermHours);
        }
        props.updateActivityName(activityName);
        props.reportInputDetails?.({
            'Meeting Name (Optional)': activityName,
            ['Meetings per ' + meetingType]: meetingQuantity,
            'Meetings length (hours)': meetingLength,
        });
    }, [activityName, meetingType, meetingQuantity, meetingLength]);

    return (
        <Fragment>
            <CustomTextField fieldLabel="Meeting Name (Optional)" defaultState={""} updateState={setActivityName} />
            <CustomTextField fieldLabel={"Meetings per " + meetingType} defaultState={1} updateState={setMeetingQuantity} fieldType="number" slotProps={{ htmlInput: { min: 0 }, input: { endAdornment: <InputAdornment position="end">{`/${meetingType}`}</InputAdornment> } }} />
            <CustomTextField fieldLabel="Meetings length (hours)" defaultState={1} updateState={setMeetingLength} fieldType="number" slotProps={{ htmlInput: { min: 0, step: 0.5 }, input: { endAdornment: <InputAdornment position="end">hours</InputAdornment> } }} />
        </Fragment>
    );
}
