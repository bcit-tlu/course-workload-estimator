import React, { useState, useEffect, Fragment } from 'react';
import CustomTextField from '../../helpers/CustomTextField';
import InputAdornment from '@mui/material/InputAdornment';
import CustomCheckBox from '../../helpers/CustomCheckBox';

export default function WatchingCalculator(props) {
    const [activityName, setActivityName] = useState("");
    const [videoLength, setVideoLength] = useState(1);
    const [videoQuantity, setVideoQuantity] = useState(1);
    const [synchronous, setSynchronous] = useState(true);

    useEffect(() => {
        props.update_s_weeklyHours(0);
        props.update_s_termHours(0);
        props.update_a_weeklyHours(0);
        props.update_a_termHours(0);

        let totalTermHours = videoLength * videoQuantity;

        if (synchronous) {
            props.update_s_termHours(totalTermHours);
        } else {
            props.update_a_termHours(totalTermHours);
        }

        props.updateActivityName(activityName);
        props.reportInputDetails?.({
            'Instructional Media Name (Optional)': activityName,
            'Hours per Instructional Video/Podcast': videoLength,
            'Instructional Video/Podcast per Course': videoQuantity,
            'Synchronous Time': synchronous,
        });
    }, [activityName, videoLength, videoQuantity, synchronous]);

    return (
        <Fragment>
            <CustomTextField fieldLabel="Instructional Media Name (Optional)" defaultState={""} updateState={setActivityName} />
            <CustomTextField fieldLabel="Hours per Instructional Video/Podcast" defaultState={1} updateState={setVideoLength} fieldType="number" slotProps={{ htmlInput: { min: 0 }, input: { endAdornment: <InputAdornment position="end">hours/video</InputAdornment> } }} />
            <CustomTextField fieldLabel="Instructional Video/Podcast per Course" defaultState={1} updateState={setVideoQuantity} fieldType="number" slotProps={{ htmlInput: { min: 0 } }} />
            <CustomCheckBox checkboxLabel="Synchronous Time" defaultState={false} updateState={setSynchronous} collapseContent={<p>Checking Synchronous Time means that the Reading & Watching Activity is part of scheduled Synchronous Meeting Time (e.g. an in-class activity) and will be calculated with the synchronous time instead of the asynchronous time.</p>} />
        </Fragment>
    );
}
