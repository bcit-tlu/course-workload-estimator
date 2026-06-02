import React, { useState, useEffect, Fragment } from 'react';
import CustomTextField from '../../helpers/CustomTextField';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import HelpIcon from '@mui/icons-material/Help';
import Collapse from '@mui/material/Collapse';

export default function ExamCalculator(props) {
    const [activityName, setActivityName] = useState("");
    const [examQuantity, setExamQuantity] = useState(2);
    const [studyLength, setStudyLength] = useState(3);
    const [format, setFormat] = useState("sync");
    const [examDuration, setExamDuration] = useState(2);
    const [isAdditional, setIsAdditional] = useState(false);
    const [additionalHelp, setAdditionalHelp] = useState(false);

    const handleIsAdditionalField = (event) => {
        setIsAdditional(event.target.value);
    };

    const handleAdditionalHelp = () => {
        setAdditionalHelp((prev) => !prev);
    };

    useEffect(() => {
        props.update_s_weeklyHours(0);
        props.update_s_termHours(0);
        props.update_a_weeklyHours(0);
        props.update_a_termHours(0);

        let studyHours = studyLength * examQuantity;
        let examHours = examDuration * examQuantity;
        let aTermHours = studyHours;

        if (format == "async") {
            aTermHours += examHours;
        } else {
            if (isAdditional) {
                props.update_s_termHours(examHours);
            }
        }

        props.update_a_termHours(aTermHours);
        props.updateActivityName(activityName);

        props.reportInputDetails?.({
            'Exam Name (Optional)': activityName,
            'Exam per Term': examQuantity,
            'Duration per Exam (Hours)': examDuration,
            'Study Hours per Exam': studyLength,
            'Format': format,
            'Final Exam is': isAdditional ? 'Additional to number of weeks/term' : 'Included within number of weeks/term',
        });
    }, [activityName, examQuantity, examDuration, studyLength, format, isAdditional]);

    return (
        <Fragment>
            <CustomTextField fieldLabel="Exam Name (Optional)" defaultState="" updateState={setActivityName} />
            <CustomTextField fieldLabel="Exam per Term" defaultState={2} updateState={setExamQuantity} fieldType="number" slotProps={{ htmlInput: { min: 0 } }} />
            <CustomTextField fieldLabel="Duration per Exam (Hours)" defaultState={2} updateState={setExamDuration} fieldType="number" slotProps={{ htmlInput: { min: 0 }, input: { endAdornment: <InputAdornment position="end">hours</InputAdornment> } }} />
            <CustomTextField fieldLabel="Study Hours per Exam" defaultState={3} updateState={setStudyLength} fieldType="number" slotProps={{ htmlInput: { min: 0 }, input: { endAdornment: <InputAdornment position="end">hours</InputAdornment> } }} collapseContent={<p>Study Hours are added to the asynchronous time total.</p>} />
            <CustomTextField fieldLabel="Format" defaultState='sync' updateState={setFormat} collapseContent={
                <div>
                    <p>Synchronous Format means that the time for the Exam is already accounted for in the Scheduled Synchronous Meeting Time and no further time will be added unless it is scheduled outside of the term weeks. Selecting Synchronous Exam will add Preparation Time to asynchronous time totals.</p>
                    <p>Asynchronous Format, usually online, is an Exam that is taken at a time of the student's discretion, usually within a set date and time constraint. The time length of the exam will be added to the asynchronous total, in addition to the Preparation Time.</p>
                </div>}
                selectContent={
                    [
                        { value: 'sync', text: 'Synchronous' },
                        { value: 'async', text: 'Asynchronous' }
                    ]}
               
            />
            {
                format == "sync" ?
                    <FormControl fullWidth>
                        <Stack direction="row" spacing={0.5}>
                            <FormLabel sx={{ width: "100%", lineHeight: "2em" }}>Final Exam is:</FormLabel>
                            <HelpIcon onClick={handleAdditionalHelp} sx={{ color: "#00a69d" }} fontSize="small" className='help-icon' />
                        </Stack>
                        <RadioGroup value={isAdditional} onChange={handleIsAdditionalField}>
                            <FormControlLabel className='form-control-label' value={false} control={<Radio />} label="Included within number of weeks/term" />
                            <FormControlLabel className='form-control-label' value={true} control={<Radio />} label="Additional to number of weeks/term" />
                        </RadioGroup>
                        <Collapse in={additionalHelp} timeout="auto" className='collapse-content'>
                            <div>
                                <p>Choose one. If the exam is scheduled within your course's number of weeks per term, nothing further will be added. If your exam is scheduled during an additional week (exam week) which is not included in your course's number of weeks per term, selecting "Additional to term week number" will add that time to the total Synchronous time.</p>
                            </div>
                        </Collapse>
                    </FormControl> : null
            }
        </Fragment>
    );
}
