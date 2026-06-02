import React, { useState, useEffect, Fragment } from 'react';
import CustomTextField from '../../helpers/CustomTextField';
import CustomCheckBox from '../../helpers/CustomCheckBox';
import FormGroup from '@mui/material/FormGroup';
import InputAdornment from '@mui/material/InputAdornment';

export default function WritingAssignmentCalculator(props) {
    const [activityName, setActivityName] = useState("");
    const [assigmentQuantity, setAssigmentQuantity] = useState(1);
    const [assignmentPages, setAssignmentPages] = useState(1);
    const [pagesDensity, setPagesDensity] = useState('250');
    const [type, setType] = useState('I');
    const [drafting, setDrafting] = useState('a');
    const [manualAdjust, setManualAdjust] = useState(false);
    const [manualPagesPerHour, setManualPagesPerHour] = useState(1);
    const [synchronous, setSynchronous] = useState(false);

    const writingAssignmentMetrics = {
        '250': {
            'I': {
                'a': 45,
                'b': 60,
                'c': 75
            },
            'II': {
                'a': 90,
                'b': 120,
                'c': 150
            },
            'III': {
                'a': 180,
                'b': 240,
                'c': 300
            }
        },
        '500': {
            'I': {
                'a': 90,
                'b': 120,
                'c': 150
            },
            'II': {
                'a': 180,
                'b': 240,
                'c': 300
            },
            'III': {
                'a': 360,
                'b': 480,
                'c': 600
            }
        }
    };


    useEffect(() => {
        props.update_s_weeklyHours(0);
        props.update_s_termHours(0);
        props.update_a_weeklyHours(0);
        props.update_a_termHours(0);

        let pagesPerHour = writingAssignmentMetrics[pagesDensity][type][drafting];
        if (manualAdjust) {
            pagesPerHour = manualPagesPerHour;
        }
        let totalTermHours = assigmentQuantity * (assignmentPages * (pagesPerHour / 60));

        if (synchronous) {
            props.update_s_termHours(totalTermHours);
        } else {
            props.update_a_termHours(totalTermHours);
        }

        props.updateActivityName(activityName);

        const details = {
            'Assignment Name (Optional)': activityName,
            'Number of Assignment': assigmentQuantity,
            'Pages per Assignment': assignmentPages,
            'Pages Density': pagesDensity,
            'Type of Writing Assignment': type,
            'Drafting': drafting,
            'Adjust Manually': manualAdjust,
            'Synchronous Time': synchronous,
        };
        if (manualAdjust) details['Pages Read per Hour'] = manualPagesPerHour;
        props.reportInputDetails?.(details);
    }, [activityName, assigmentQuantity, assignmentPages, pagesDensity, type, drafting, manualAdjust, manualPagesPerHour, synchronous]);

    return (
        <Fragment>
            <CustomTextField fieldLabel="Assignment Name (Optional)" defaultState={""} updateState={setActivityName} />
            <CustomTextField fieldLabel="Number of Assignment" defaultState={1} updateState={setAssigmentQuantity} fieldType="number" slotProps={{ htmlInput: { min: 0 } }} />
            <CustomTextField fieldLabel="Pages per Assignment" defaultState={1} updateState={setAssignmentPages} fieldType="number" slotProps={{ htmlInput: { min: 0 }, input: { endAdornment: <InputAdornment position="end">pages</InputAdornment> } }} />
            <CustomTextField fieldLabel="Pages Density" defaultState='250' updateState={setPagesDensity} selectContent={[
                { value: '250', text: '250 words' },
                { value: '500', text: '500 words' }
            ]} />
            <CustomTextField fieldLabel="Type of Writing Assignment" defaultState='I' updateState={setType} selectContent={[
                { value: 'I', text: 'Personal/Reflective/Journal/Peer Review' },
                { value: 'II', text: 'Argument/Case Study Analysis' },
                { value: 'III', text: 'Research Paper/Technical Report' }
            ]} />
            <CustomTextField fieldLabel="Drafting" defaultState='a' updateState={setDrafting} selectContent={[
                { value: 'a', text: 'No Drafting' },
                { value: 'b', text: 'Minimal Drafting' },
                { value: 'c', text: 'Extensive Drafting' }
            ]} />

            <FormGroup className='form-group-toggle'>
                <CustomCheckBox checkboxLabel="Adjust Manually" defaultState={false} updateState={setManualAdjust} />
                {
                    manualAdjust &&
                    <CustomTextField fieldLabel="Pages Read per Hour" defaultState={1} updateState={setManualPagesPerHour} fieldType="number" slotProps={{ htmlInput: { min: 0 }, input: { endAdornment: <InputAdornment position="end">pages/hour</InputAdornment> } }} />
                }
            </FormGroup>
            <CustomCheckBox checkboxLabel="Synchronous Time" defaultState={false} updateState={setSynchronous} collapseContent={<p>Checking Synchronous Time means that the Reading & Watching Activity is part of scheduled Synchronous Meeting Time (e.g. an in-class activity) and will be calculated with the synchronous time instead of the asynchronous time.</p>} />
        </Fragment>
    );
}
