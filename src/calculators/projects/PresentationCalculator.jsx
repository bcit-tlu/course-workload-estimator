import React, { useState, useEffect, Fragment } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import CustomTextField from '../../helpers/CustomTextField';

export default function PresentationCalculator(props) {
    const [activityName, setActivityName] = useState("");
    const [presentationQuantity, setPresentationQuantity] = useState(1);
    const [prepTime, setPrepTime] = useState(1);


    useEffect(() => {
        props.update_s_weeklyHours(0);
        props.update_s_termHours(0);
        props.update_a_weeklyHours(0);
        props.update_a_termHours(0);

        let aTermHours = presentationQuantity * prepTime;

        props.update_a_termHours(aTermHours);
        props.updateActivityName(activityName);
        props.reportInputDetails?.({
            'Activity Name (Optional)': activityName,
            'Number of Presentations per Course': presentationQuantity,
            'Prep. Time per Presentation (Hrs)': prepTime,
        });
    }, [activityName, presentationQuantity, prepTime]);

    return (
        <Fragment>
            <CustomTextField fieldLabel="Activity Name (Optional)" defaultState={""} updateState={setActivityName} />
            <CustomTextField fieldLabel="Number of Presentations per Course" defaultState={1} updateState={setPresentationQuantity} fieldType="number" slotProps={{ htmlInput: { min: 0 }, input: { endAdornment: <InputAdornment position="end">/course</InputAdornment> } }} />
            <CustomTextField fieldLabel="Prep. Time per Presentation (Hrs)" defaultState={1} updateState={setPrepTime} fieldType="number" slotProps={{ htmlInput: { min: 0 }, input: { endAdornment: <InputAdornment position="end">hours</InputAdornment> } }} />
        </Fragment>
    );
}
