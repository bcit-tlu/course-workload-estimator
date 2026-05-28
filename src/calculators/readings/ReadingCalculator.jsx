import React, { useState, useEffect, Fragment } from 'react';
import CustomTextField from '../../helpers/CustomTextField';
import CustomCheckBox from '../../helpers/CustomCheckBox';
import FormGroup from '@mui/material/FormGroup';
import InputAdornment from '@mui/material/InputAdornment';

export default function ReadingCalculator(props) {
    const [activityName, setActivityName] = useState("");
    const [pagesPerWeek, setPagesPerWeek] = useState(1);
    const [pagesDensity, setPagesDensity] = useState('450');
    const [difficulty, setDifficulty] = useState('I');
    const [purpose, setPurpose] = useState('a');
    const [manualAdjust, setManualAdjust] = useState(false);
    const [manualPagesPerHour, setManualPagesPerHour] = useState(1);
    const [synchronous, setSynchronous] = useState(false);

    const readingMetrics = {
        '450': {
            'I': {
                'a': 67,
                'b': 47,
                'c': 33
            },
            'II': {
                'a': 33,
                'b': 24,
                'c': 17
            },
            'III': {
                'a': 17,
                'b': 12,
                'c': 9
            }
        },
        '600': {
            'I': {
                'a': 50,
                'b': 35,
                'c': 25
            },
            'II': {
                'a': 25,
                'b': 18,
                'c': 13
            },
            'III': {
                'a': 13,
                'b': 9,
                'c': 7
            }
        },
        '750': {
            'I': {
                'a': 40,
                'b': 28,
                'c': 20
            },
            'II': {
                'a': 20,
                'b': 14,
                'c': 10
            },
            'III': {
                'a': 10,
                'b': 7,
                'c': 5
            }
        }
    };


    useEffect(() => {
        props.update_s_weeklyHours(0);
        props.update_s_termHours(0);
        props.update_a_weeklyHours(0);
        props.update_a_termHours(0);

        let pagesPerHour = readingMetrics[pagesDensity][difficulty][purpose];
        if (manualAdjust) {
            pagesPerHour = manualPagesPerHour;
        }

        let totalWeeklyHours = pagesPerWeek / pagesPerHour;
        if (synchronous) {
            props.update_s_weeklyHours(totalWeeklyHours);
        } else {
            props.update_a_weeklyHours(totalWeeklyHours);
        }
        props.updateActivityName(activityName);
        const details = {
            'Activity Name (Optional)': activityName,
            'Pages per Week': pagesPerWeek,
            'Pages Density': pagesDensity,
            'Difficulty': difficulty,
            'Purpose': purpose,
            'Adjust Manually': manualAdjust,
            'Synchronous Time': synchronous,
        };
        if (manualAdjust) details['Pages Read per Hour'] = manualPagesPerHour;
        props.reportInputDetails?.(details);
    }, [activityName, pagesPerWeek, pagesDensity, difficulty, purpose, manualAdjust, manualPagesPerHour, synchronous]);

    return (
        <Fragment>
            <CustomTextField fieldLabel="Activity Name (Optional)" defaultState={""} updateState={setActivityName} />
            <CustomTextField fieldLabel="Pages per Week" defaultState={1} updateState={setPagesPerWeek} fieldType="number" slotProps={{ htmlInput: { min: 0 }, input: { endAdornment: <InputAdornment position="end">pages</InputAdornment> } }} />
            <CustomTextField fieldLabel="Pages Density" defaultState='450' updateState={setPagesDensity} selectContent={[
                { value: '450', text: '450 words' },
                { value: '600', text: '600 words' },
                { value: '750', text: '750 words' }
            ]} />
            <CustomTextField fieldLabel="Difficulty" defaultState='I' updateState={setDifficulty} selectContent={[
                { value: 'I', text: 'No New Concepts' },
                { value: 'II', text: 'Some New Concepts' },
                { value: 'III', text: 'Many New Concepts' }
            ]} />
            <CustomTextField fieldLabel="Purpose" defaultState='a' updateState={setPurpose} selectContent={[
                { value: 'a', text: 'Survey' },
                { value: 'b', text: 'Understand' },
                { value: 'c', text: 'Engage' }
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
