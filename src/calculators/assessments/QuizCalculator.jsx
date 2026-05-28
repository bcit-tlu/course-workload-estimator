import React, { useState, useEffect, Fragment } from 'react';
import CustomTextField from '../../helpers/CustomTextField';
import InputAdornment from '@mui/material/InputAdornment';


export default function QuizCalculator(props) {
    const [activityName, setActivityName] = useState("");
    const [quizQuantity, setQuizQuantity] = useState(2);
    const [studyLength, setStudyLength] = useState(3);
    const [format, setFormat] = useState("sync");
    const [quizDuration, setQuizDuration] = useState(15);


    useEffect(() => {
        props.update_s_weeklyHours(0);
        props.update_s_termHours(0);
        props.update_a_weeklyHours(0);
        props.update_a_termHours(0);

        let termHours = studyLength * quizQuantity;

        if (format == "async") {
            let aTermHours = termHours + (quizDuration * quizQuantity) / 60;
            props.update_a_termHours(aTermHours);
        } else {
            props.update_a_termHours(termHours);
        }

        props.updateActivityName(activityName);

        const details = {
            'Quiz/Test Name (Optional)': activityName,
            'Quiz/Test per Term': quizQuantity,
            'Study Hours per Quiz/Test': studyLength,
            'Format': format,
        };
        if (format === 'async') details['Duration per Quiz/Test (minutes)'] = quizDuration;
        props.reportInputDetails?.(details);
    }, [activityName, quizQuantity, studyLength, format, quizDuration]);

    return (
        <Fragment>
            <CustomTextField fieldLabel="Quiz/Test Name (Optional)" defaultState="" updateState={setActivityName} />

            <CustomTextField fieldLabel="Quiz/Test per Term" defaultState={2} updateState={setQuizQuantity} fieldType="number" slotProps={{ htmlInput: { min: 0 } }} />

            <CustomTextField fieldLabel="Study Hours per Quiz/Test" defaultState={3} updateState={setStudyLength} fieldType="number" slotProps={{ htmlInput: { min: 0 }, input: { endAdornment: <InputAdornment position="end">hours</InputAdornment> } }} collapseContent={<p>Study Hours are added to the asynchronous time total.</p>} />

            <CustomTextField fieldLabel="Format" defaultState='sync' updateState={setFormat} collapseContent={
                <div>
                    <p>Synchronous Format means that the time is already accounted for in the Scheduled Synchronous Meeting Time and no further time will be added. Selecting Synchronous will take the student's Preparation Time and add to asynchronous time.</p>
                    <p>Asynchronous Format, usually online, are Quizzes & Tests that are taken at a time of the student's discretion, usually within a set date and time constraint. The time length of the Quizzes & Tests will be added to the asynchronous total, in addition to the Preparation Time.</p>
                </div>}
                selectContent={
                    [
                        { value: 'sync', text: 'Synchronous' },
                        { value: 'async', text: 'Asynchronous' }
                    ]}
               
            />
            {
                format == "async" ?
                    <CustomTextField fieldLabel="Duration per Quiz/Test (in minutes)" defaultState={15} updateState={setQuizDuration} fieldType="number" slotProps={{ htmlInput: { min: 0 }, input: { endAdornment: <InputAdornment position="end">minutes</InputAdornment> } }} collapseContent={<p>Duration per Quiz/Test (in minutes)</p>} /> : null
            }

        </Fragment>
    );
}
