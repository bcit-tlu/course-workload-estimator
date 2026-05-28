import React, { useState, useEffect, Fragment } from 'react';
import CustomTextField from '../../helpers/CustomTextField';
import CustomCheckBox from '../../helpers/CustomCheckBox';
import FormGroup from '@mui/material/FormGroup';
import InputAdornment from '@mui/material/InputAdornment';

export default function DiscussionCalculator(props) {
    const [activityName, setActivityName] = useState("");
    const [discussionQuantity, setDiscussionQuantity] = useState(1);
    const [postQuantity, setPostQuantity] = useState(1);
    const [avgPostLength, setAvgPostLength] = useState(200);
    const [responseQuantity, setResponseQuantity] = useState(1);
    const [avgResponseLength, setAvgResponseLength] = useState(100);
    const [manualAdjust, setManualAdjust] = useState(false);
    const [manualDiscussionPerHour, SetManualDiscussionPerHour] = useState(1);


    useEffect(() => {
        props.update_s_weeklyHours(0);
        props.update_s_termHours(0);
        props.update_a_weeklyHours(0);
        props.update_a_termHours(0);

        let totalTermHours = 0;
        if (manualAdjust) {
            totalTermHours = discussionQuantity * manualDiscussionPerHour;
        } else {
            let postHours = postQuantity * (avgPostLength / 250);
            let responseHours = responseQuantity * (avgResponseLength / 250);
            totalTermHours = (discussionQuantity * postHours) + (discussionQuantity * responseHours);
        }

        props.update_a_termHours(totalTermHours);
        props.updateActivityName(activityName);

        const details = {
            'Discussion Name (Optional)': activityName,
            'Number of Discussions per Course': discussionQuantity,
            'Original Posts': postQuantity,
            'Average Post Length (words)': avgPostLength,
            'Responses': responseQuantity,
            'Average Response Length (words)': avgResponseLength,
            'Adjust Manually': manualAdjust,
        };
        if (manualAdjust) details['Hours per discussion'] = manualDiscussionPerHour;
        props.reportInputDetails?.(details);
    }, [activityName, discussionQuantity, postQuantity, avgPostLength, responseQuantity, avgResponseLength, manualAdjust, manualDiscussionPerHour]);

    return (
        <Fragment>
            <CustomTextField fieldLabel="Discussion Name (Optional)" defaultState={""} updateState={setActivityName} />
            <CustomTextField fieldLabel="Number of Discussions per Course" defaultState={1} updateState={setDiscussionQuantity} fieldType="number" slotProps={{ htmlInput: { min: 0 } }} collapseContent={<p>Add how many discussions you have scheduled in your course where students are expected to participate.</p>} />
            <CustomTextField fieldLabel="Original Posts" defaultState={1} updateState={setPostQuantity} fieldType="number" slotProps={{ htmlInput: { min: 0 }, input: { endAdornment: <InputAdornment position="end">posts</InputAdornment> } }} collapseContent={<p>Add how many posted contributions you expect students to make, where they have to research and reflect to create their own contribution.</p>} />
            <CustomTextField fieldLabel="Average Post Length (words)" defaultState={200} updateState={setAvgPostLength} fieldType="number" slotProps={{ htmlInput: { min: 0 }, input: { endAdornment: <InputAdornment position="end">words</InputAdornment> } }} collapseContent={<p>By default, the calculation for the Average Post Length is based on an estimate of 250 words per hour.</p>} />
            <CustomTextField fieldLabel="Responses" defaultState={1} updateState={setResponseQuantity} fieldType="number" slotProps={{ htmlInput: { min: 0 }, input: { endAdornment: <InputAdornment position="end">responses</InputAdornment> } }} />
            <CustomTextField fieldLabel="Average Response Length (words)" defaultState={100} updateState={setAvgResponseLength} fieldType="number" slotProps={{ htmlInput: { min: 0 }, input: { endAdornment: <InputAdornment position="end">words</InputAdornment> } }} collapseContent={<p>By default, the calculation for the Average Response Length is based on an estimate of 125 words per half hour.</p>} />

            <FormGroup className='form-group-toggle'>
                <CustomCheckBox checkboxLabel="Adjust Manually" defaultState={false} updateState={setManualAdjust} />
                {
                    manualAdjust &&
                    <CustomTextField fieldLabel="Hours per discussion" defaultState={1} updateState={SetManualDiscussionPerHour} fieldType="number" slotProps={{ htmlInput: { min: 0 }, input: { endAdornment: <InputAdornment position="end">hour/discussion</InputAdornment> } }} />
                }
            </FormGroup>
        </Fragment>
    );
}
