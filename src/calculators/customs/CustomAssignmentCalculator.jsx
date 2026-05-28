import React, { useState, useEffect, Fragment } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import CustomTextField from '../../helpers/CustomTextField';
import CustomCheckBox from '../../helpers/CustomCheckBox';

export default function CustomAssignmentCalculator(props) {
    const [activityName, setActivityName] = useState("");
    const [assignmentQuantity, setAssignmentQuantity] = useState(1);
    const [assignmentPrepHours, setAssignmentPrepHours] = useState(0);
    const [assignmentLength, setAssignmentLength] = useState(1);
    const [postAssignmentHours, setPostAssignmentHours] = useState(1);
    const [synchronous, setSynchronous] = useState(false);


    useEffect(() => {
        props.update_s_weeklyHours(0);
        props.update_s_termHours(0);
        props.update_a_weeklyHours(0);
        props.update_a_termHours(0);

        let aTermHours = (assignmentQuantity * assignmentPrepHours) + (assignmentQuantity * postAssignmentHours);
        let totalAssignmentLength = assignmentQuantity * assignmentLength;

        if (synchronous) {
            props.update_s_termHours(totalAssignmentLength);
        } else {
            aTermHours += totalAssignmentLength;
        }

        props.update_a_termHours(aTermHours);
        props.updateActivityName(activityName);
        props.reportInputDetails?.({
            'Assignment Name (Optional)': activityName,
            'Custom Assignments per Course': assignmentQuantity,
            'Preparation Time per Assignment (Hours)': assignmentPrepHours,
            'Hours per Assignment': assignmentLength,
            'Post-Activity Reporting Time per Assignment (Hrs)': postAssignmentHours,
            'Synchronous Time': synchronous,
        });
    }, [activityName, assignmentQuantity, assignmentPrepHours, assignmentLength, postAssignmentHours, synchronous]);

    return (
        <Fragment>
            <CustomTextField fieldLabel="Assignment Name (Optional)" defaultState={""} updateState={setActivityName} />
            <CustomTextField fieldLabel={"Custom Assignments per Course"} defaultState={1} updateState={setAssignmentQuantity} fieldType="number" slotProps={{ htmlInput: { min: 0 }, input: { endAdornment: <InputAdornment position="end">/course</InputAdornment> } }} />
            <CustomTextField fieldLabel="Preparation Time per Assignment (Hours)" defaultState={0} updateState={setAssignmentPrepHours} fieldType="number" slotProps={{ htmlInput: { min: 0 }, input: { endAdornment: <InputAdornment position="end">hours</InputAdornment> } }} collapseContent={<p>Optional. This time will be added to the asynchronous category in the Workload Summary.</p>} />
            <CustomTextField fieldLabel="Hours per Assignment" defaultState={1} updateState={setAssignmentLength} fieldType="number" slotProps={{ htmlInput: { min: 0 }, input: { endAdornment: <InputAdornment position="end">hours</InputAdornment> } }} collapseContent={<p>When the Synchronous box is checked, the hours are assigned to the synchronous totals. If the check is removed, all hours are assigned to the asynchronous category in the Workload Summary.</p>} />
            <CustomCheckBox checkboxLabel="Synchronous Time" defaultState={false} updateState={setSynchronous} />
            <CustomTextField fieldLabel="Post-Activity Reporting Time per Assignment (Hrs)" defaultState={1} updateState={setPostAssignmentHours} fieldType="number" slotProps={{ htmlInput: { min: 0 }, input: { endAdornment: <InputAdornment position="end">hours</InputAdornment> } }} collapseContent={<p>Optional. This time will be added to the asynchronous category in the Workload Summary.</p>} />

        </Fragment>
    );
}
