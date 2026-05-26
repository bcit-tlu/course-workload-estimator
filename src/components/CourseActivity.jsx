import React, { useState } from 'react';
import FormGroup from '@mui/material/FormGroup';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import createActivityString from '../helpers/createActivityString';
import components from '../helpers/components';
import MeetingCalculator from '../calculators/meetings/MeetingCalculator';
import LabsCalculator from '../calculators/practices/LabsCalculator';
import ClinicalCalculator from '../calculators/practices/ClinicalCalculator';
import ReadingCalculator from '../calculators/readings/ReadingCalculator';
import WatchingCalculator from '../calculators/watchings/WatchingCalculator';
import DiscussionCalculator from '../calculators/writings/DiscussionCalculator';
import WritingAssignmentCalculator from '../calculators/writings/WritingAssignmentCalculator';
import ProjectCalculator from '../calculators/projects/ProjectCalculator';
import PresentationCalculator from '../calculators/projects/PresentationCalculator';
import ExamCalculator from '../calculators/assessments/ExamCalculator';
import QuizCalculator from '../calculators/assessments/QuizCalculator';
import CustomAssignmentCalculator from '../calculators/customs/CustomAssignmentCalculator';
import { useTrackEvent } from '../analytics/AnalyticsContext';


export default function CourseActivity(props) {
    const trackEvent = useTrackEvent();
    const [activityName, setActivityName] = useState("");
    const [s_weeklyHours, set_s_weeklyHours] = useState(0);
    const [s_termHours, set_s_termHours] = useState(0);
    const [a_weeklyHours, set_a_weeklyHours] = useState(0);
    const [a_termHours, set_a_termHours] = useState(0);
    const activityProps = {
        ...{ updateActivityName: setActivityName },
        ...{ update_s_weeklyHours: set_s_weeklyHours },
        ...{ update_s_termHours: set_s_termHours },
        ...{ update_a_weeklyHours: set_a_weeklyHours },
        ...{ update_a_termHours: set_a_termHours },
    };

    const renderCalculator = () => {
        switch (props.componentIndex) {
            case 0:
                switch (props.activityIndex) {
                    case 0:
                        return <MeetingCalculator meetingType="week" {...activityProps}></MeetingCalculator>;
                    case 1:
                        return <MeetingCalculator meetingType="term" {...activityProps}></MeetingCalculator>;
                }
            case 1:
                switch (props.activityIndex) {
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                        return <LabsCalculator {...activityProps}></LabsCalculator>;
                    case 6:
                    case 7:
                        return <ClinicalCalculator {...activityProps}></ClinicalCalculator>;
                }
            case 2:
                switch (props.activityIndex) {
                    case 0:
                        return <ReadingCalculator {...activityProps}></ReadingCalculator>;
                    case 1:
                        return <WatchingCalculator {...activityProps}></WatchingCalculator>;
                }
            case 3:
                switch (props.activityIndex) {
                    case 0:
                        return <DiscussionCalculator {...activityProps}></DiscussionCalculator>;
                    case 1:
                        return <WritingAssignmentCalculator {...activityProps}></WritingAssignmentCalculator>;
                }
            case 4:
                switch (props.activityIndex) {
                    case 0:
                    case 1:
                        return <ProjectCalculator {...activityProps}></ProjectCalculator>;
                    case 2:
                        return <PresentationCalculator {...activityProps}></PresentationCalculator>;
                }
            case 5:
                switch (props.activityIndex) {
                    case 0:
                        return <ExamCalculator {...activityProps}></ExamCalculator>;
                    case 1:
                        return <QuizCalculator {...activityProps}></QuizCalculator>;
                }
            case 6:
                switch (props.activityIndex) {
                    case 0:
                        return <CustomAssignmentCalculator {...activityProps}></CustomAssignmentCalculator>;
                }
        }
    };

    const addActivity = async () => {
        try {
            let newActivityString = createActivityString(props.componentIndex, props.activityIndex, activityName, s_weeklyHours, s_termHours, a_weeklyHours, a_termHours);
            await props.updateSummary(newActivityString);

            const componentKeys = Object.keys(components);
            const componentName = componentKeys[props.componentIndex] || 'Unknown';
            trackEvent('activity_added_to_summary', {
                activity_name: props.activityName,
                component_name: componentName,
                hours_calculated: String(s_weeklyHours + s_termHours + a_weeklyHours + a_termHours),
            });
        } catch (error) {
            console.error("Error in addActivity", error);
        }
    };

    return (
        <Box className='course-activity-container' key={"form-group-" + props.componentIndex + "-" + props.activityIndex}>
            <FormGroup className='calculator-text-field'>{renderCalculator()}</FormGroup>
            <Box textAlign='center'>
                <Button variant="contained" size="large" onClick={addActivity}>Add Activity</Button>
            </Box>
        </Box>
    );
}
