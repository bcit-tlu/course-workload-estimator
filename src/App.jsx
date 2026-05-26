import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import components from './helpers/components';
import CustomTextField from './helpers/CustomTextField';
import CourseActivity from './components/CourseActivity';
import Summary from './components/Summary';
import logo from './assets/bcit_rev.png';
import Link from '@mui/material/Link';
import { AnalyticsProvider, useTrackEvent } from './analytics/AnalyticsContext';
import { logEvent } from './analytics/init';

const LOGO_SRC = process.env.NODE_ENV === 'production' ? '/bcit_rev.png' : logo;

let theme = createTheme({
    breakpoints: {
        values: {
            xs: 0,
            sm: 700,
            md: 900,
            lg: 1200,
            xl: 1700,
        },
    },
});

theme.typography.h1 = {
    fontSize: '1.5rem',
    '@media (min-width:600px)': {
        fontSize: '2rem',
    },
    [theme.breakpoints.up('md')]: {
        fontSize: '2.5rem',
    },
};

const App = () => {

    const boxStyle = {
        backgroundColor: 'rgb(0 126 255 / 10%)',
        padding: '1em',
        borderRadius: '5px',
        margin: '1em 0'
    };

    const [componentIndex, setComponentIndex] = useState(0);
    const [activityIndex, setActivityIndex] = useState(0);
    const [courseDuration, setCourseDuration] = useState(12);
    const [courseCredits, setCourseCredits] = useState(3);
    const [summary, setSummary] = useState(localStorage.getItem('bcitcourseworkloadestimator'));
    const trackEvent = useTrackEvent();

    useEffect(() => {
        logEvent('page_view', { url: window.location.href });
    }, []);
    const activityDesciptions = [
        <div>
            <p>Use <strong>Course Meetings per Week</strong> for scheduled synchronous (same time, same place) in-person and/or online sessions which students are expected to attend each week during the length of the course (vectored scheduling).</p>
            <p>Use <strong>Course Meetings per Term</strong> for synchronous sessions that have alternative scheduling, such as Flipped Classes and Directed and Independent Studies, which are not regularly scheduled each week but are scheduled during the length of the course (non-vectored).</p>
        </div>,
        null,
        <div>
            <p>Reading & Watching Activities will be added to Asynchronous Time as students are expected to complete these outside of scheduled synchronous time.</p>
            <p>Learning from <strong>reading</strong> includes online learning modules.</p>
            <p><strong>Videos/podcasts</strong> includes the time involved in watching or listening to media (such as recorded lectures and assigned videos) as well as time for note-taking.</p>
        </div>,
        <div>
            <p><strong>Online Discussion Forums</strong> count as asynchronous time where the student completes scheduled learning outside of synchronous time.</p>
            <p><strong>Writing Assignment</strong> is calculated and added under Asynchronous Time, unless you check the Synchronous box.</p>
        </div>,
        <div>
            <p><strong>Group and Individual Project</strong> count as asynchronous time where the student completes scheduled learning outside of synchronous time, unless you check the synchronous box.</p>
            <p><strong>Presentations</strong> measures the preparation time (adding it to asynchronous time) and not the in-class presenting time (which is accounted for under Scheduled Course Meeting Time).</p>
        </div>,
        <p><strong>Exams</strong> are the major mid-term and final exams while <strong>Tests and Quizzes</strong> are either lower-stakes or no-stakes assessments.</p>,
        <p>Use <strong>Custom Assignment</strong> for anything that falls outside of the other categories.</p>
    ];
    const activities = [];
    components[Object.keys(components)[componentIndex]].map((activity, index) => (
        activities.push({ value: index, text: activity })
    ));

    const handleCourseDurationField = (event) => {
        const isNumber = /^\d*\.?\d*$/.test(event.target.value);
        if (isNumber) {
            setCourseDuration(event.target.value);
            trackEvent('course_duration_changed', { new_value: event.target.value });
        }
    };

    const handleCourseCreditsField = (event) => {
        const isNumber = /^\d*\.?\d*$/.test(event.target.value);
        if (isNumber) {
            setCourseCredits(event.target.value);
            trackEvent('course_credits_changed', { new_value: event.target.value });
        }
    };

    const handleCourseComponentField = (event) => {
        const index = parseInt(event.target.value);
        setActivityIndex(0);
        setComponentIndex(index);
        trackEvent('component_selected', {
            component_name: Object.keys(components)[index],
            component_index: index,
        });
    };

    const updateSummary = (newActivityString) => {
        localStorage.setItem('bcitcourseworkloadestimator', newActivityString);
        setSummary(newActivityString);
    };

    const handleCourseComponentRadio = (e, index) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            setComponentIndex(index);
        }
    };


    return (
        <ThemeProvider theme={theme}>
            <Box display="flex" flexDirection="column" minHeight="100vh">
                <AppBar position="static" className="no-print" sx={{ bgcolor: "#003c71", height: '80px', paddingTop: '8px', paddingBottom: '8px' }}>
                    <Toolbar sx={{ width: { xs: 'auto', sm: 'auto', md: 'auto', lg: 'auto', xl: '1487px' }, margin: { xl: '0 auto' }, padding: { xl: '0' } }}>
                        <Box component="img" alt="BCIT logo" src={LOGO_SRC} sx={{ height: '50px', marginRight: '1em', maxHeight: { xs: 50, xl: 50 } }} />
                        <Typography variant="h1" sx={{ flexGrow: 1 }}>
                            Course Workload Estimator
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Box flexGrow={1}>
                    <Container maxWidth="xl">
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={5} md={5} lg={4} xl={3} className="no-print">
                                <Box sx={boxStyle}>
                                    <FormControl fullWidth className='calculator-text-field'>
                                        <FormLabel>Course Details:</FormLabel>
                                        <TextField size="small" fullWidth label="Number of scheduled weeks" value={courseDuration} type="number" InputProps={{ inputProps: { min: 0 }, endAdornment: " weeks" }} onChange={handleCourseDurationField} />
                                        <TextField size="small" fullWidth label="Number of credits" value={courseCredits} type="number" InputProps={{ inputProps: { min: 0.5, step: 0.5 } }} onChange={handleCourseCreditsField} />
                                    </FormControl>
                                </Box>
                                <Box sx={boxStyle}>
                                    <FormControl fullWidth>
                                        <FormLabel>Course Component:</FormLabel>
                                        <RadioGroup tabIndex="-1" value={componentIndex} onChange={handleCourseComponentField} aria-labelledby="course component radio button group">
                                            {Object.keys(components).map((component, index) => (
                                                <FormControlLabel tabIndex="0" onKeyDown={(e) => handleCourseComponentRadio(e, index)} className='form-control-label' key={'course-component-' + index} value={index} control={<Radio tabIndex="-1" checked={index === componentIndex} />} label={component} />
                                            ))}
                                        </RadioGroup>
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={7} md={7} lg={4} xl={3} className="no-print">
                                <Box sx={boxStyle} className="course-components-container" key={"course-activities-" + componentIndex}>
                                    <CustomTextField fieldLabel="Course Activity" defaultState={activityIndex} updateState={setActivityIndex} collapseContent={activityDesciptions[componentIndex]} selectContent={activities} />

                                    <CourseActivity componentIndex={componentIndex} activityIndex={activityIndex} updateSummary={updateSummary} activityName={activities[activityIndex].text}></CourseActivity>
                                </Box>
                            </Grid>

                            <Grid item xs={12} sm={12} md={12} lg={4} xl={6}>
                                <Summary duration={courseDuration} summary={summary} updateSummary={updateSummary}></Summary>
                            </Grid>

                        </Grid>
                        <Accordion autoFocus className='no-print' onChange={(_, expanded) => expanded && trackEvent('accordion_expanded', { accordion_title: 'About this Course Workload Estimator' })}>
                            <AccordionSummary className='accordion-summary-background' expandIcon={<ExpandMoreIcon />} aria-controls="about-this-panel">
                                <Typography>About this Course Workload Estimator</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <p>This calculator is a tool for instructors to use to estimate the total course workload for students to complete the course.</p>
                                <p>Use the tool when you are planning your course. Use it alongside when you are completing your course outline and course syllabus, and deciding on the activities and evaluation plan for your course. The tool is not meant to be precise and granular (we measure in hours and not minutes).</p>
                                <p>The tool provides an estimate, so that you have an overall picture of the workload of your students, week-by-week, as well as for the total course.</p>
                                <p>Once you have a course summary, you will be able to ask of your course syllabus:</p>
                                <ul>
                                    <li>Is this workload achievable given the time constraints of the course?</li>
                                    <li>Is the course workload fair given the credit count for the course?</li>
                                </ul>
                                <p>You might share the results of the Estimator with your students to show them the overall workload they can expect and plan for. Or you can also just use the results to communicate to your students how much homework they can expect.</p>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion autoFocus className='no-print' onChange={(_, expanded) => expanded && trackEvent('accordion_expanded', { accordion_title: 'What is Scheduled Learning?' })}>
                            <AccordionSummary className='accordion-summary-background' expandIcon={<ExpandMoreIcon />} aria-controls="scheduled-learning-panel">
                                <Typography>What is "Scheduled Learning"?</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <p>Scheduled Learning is the time that you expect students to set aside to complete your course. It might include both attending weekly lectures and completing readings and project work outside of class time, or it might include online reading and participating in asynchronous discussion forums on a weekly basis.</p>
                                <p>In an effort to include the diverse learning formats in practice at BCIT, we have attempted to incorporate online, in-person, practice-based experiential learning, synchronous and asynchronous learning modes into an inclusive term.</p>
                                <p>Scheduled learning is divided into "synchronous" and "asynchronous", where synchronous activities are taking place in the same location at the same time (online or in-person), and asynchronous activities are components that you've assigned to your students that can be completed outside of synchronous time. Your entire course might be asynchronous, such as some of our fully online courses, and they are also counted as scheduled learning.</p>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion autoFocus className='no-print' onChange={(_, expanded) => expanded && trackEvent('accordion_expanded', { accordion_title: 'Details of Estimation Calculation & Sources' })}>
                            <AccordionSummary className='accordion-summary-background' expandIcon={<ExpandMoreIcon />} aria-controls="estimation-calculation-panel">
                                <Typography>Details of Estimation Calculation & Sources</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <p>We based the calculations for Reading, Writing and Group and Individual Project on the sources and metrics described below. We have meant for these calculations to be the beginning of deriving an estimate; because there is immense variation in average rates, we have also added to each of these activities the option for you to adjust the estimates manually.</p>
                                <h3 id='project-calculation'>Group and Individual Projects</h3>
                                <p>The estimations used for project size are estimated per student as follows:</p>
                                <ul>
                                    <li>Small = 2 hours/week</li>
                                    <li>Medium = 7 hours/week</li>
                                    <li>Large = 13 hours/week</li>
                                </ul>
                                <h3 id='reading-calculation'>Reading</h3>
                                <p>The reading calculations are estimations based on the work of the work of Barre, Brown, and Esarey (see <a href="https://cte.rice.edu/resources/course-workload-estimator" target="_blank">Estimation Details</a>).</p>
                                <TableContainer sx={{ width: "fit-content" }} component={Paper}>
                                    <Table sx={{ width: "fit-content" }} aria-label="reading table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align='center'>Reading Purpose and Learning Complexity</TableCell>
                                                <TableCell align='center'>450 Words (Paperback)</TableCell>
                                                <TableCell align='center'>600 Words (Monograph)</TableCell>
                                                <TableCell align='center'>750 Words (Textbook)</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell component="th">Survey; No New Concepts (500 wpm)</TableCell>
                                                <TableCell>67 pages per hour</TableCell>
                                                <TableCell>50 pages per hour</TableCell>
                                                <TableCell>40 pages per hour</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th">Survey; Some New Concepts (350 wpm)</TableCell>
                                                <TableCell>47 pages per hour</TableCell>
                                                <TableCell>35 pages per hour</TableCell>
                                                <TableCell>28 pages per hour</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th">Survey; Many New Concepts (250 wpm)</TableCell>
                                                <TableCell>33 pages per hour</TableCell>
                                                <TableCell>25 pages per hour</TableCell>
                                                <TableCell>20 pages per hour</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th">Understand; No New Concepts (250 wpm)</TableCell>
                                                <TableCell>33 pages per hour</TableCell>
                                                <TableCell>25 pages per hour</TableCell>
                                                <TableCell>20 pages per hour</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th">Understand; Some New Concepts (180 wpm)</TableCell>
                                                <TableCell>24 pages per hour</TableCell>
                                                <TableCell>18 pages per hour</TableCell>
                                                <TableCell>14 pages per hour</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th">Understand; Many New Concepts (130 wpm)</TableCell>
                                                <TableCell>17 pages per hour</TableCell>
                                                <TableCell>13 pages per hour</TableCell>
                                                <TableCell>10 pages per hour</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th">Engage; No New Concepts (130 wpm)</TableCell>
                                                <TableCell>17 pages per hour</TableCell>
                                                <TableCell>13 pages per hour</TableCell>
                                                <TableCell>10 pages per hour</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th">Engage; Some New Concepts (90 wpm)</TableCell>
                                                <TableCell>12 pages per hour</TableCell>
                                                <TableCell>9 pages per hour</TableCell>
                                                <TableCell>7 pages per hour</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th">Engage; Many New Concepts (65 wpm)</TableCell>
                                                <TableCell>9 pages per hour</TableCell>
                                                <TableCell>7 pages per hour</TableCell>
                                                <TableCell>5 pages per hour</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <h3 id='writing-calculation'>Writing</h3>
                                <p>The writing calculations are estimations based on the work of the work of Barre, Brown, and Esarey (see <a href="https://cte.rice.edu/resources/course-workload-estimator" target="_blank">Estimation Details</a>).</p>
                                <TableContainer sx={{ width: "fit-content" }} component={Paper}>
                                    <Table sx={{ width: "fit-content" }} aria-label="writing table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align='center'>Writing Purpose and Degree of Process</TableCell>
                                                <TableCell align='center'>250 Words (Double Spaced)</TableCell>
                                                <TableCell align='center'>500 Words (Single Spaced)</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell component="th">Reflection/Narrative; No Drafting</TableCell>
                                                <TableCell>45 minutes per page</TableCell>
                                                <TableCell>1 hour 30 minutes per page</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th">Reflection/Narrative; Minimal Drafting</TableCell>
                                                <TableCell>1 hour per page</TableCell>
                                                <TableCell>2 hours per page</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th">Reflection/Narrative; Extensive Drafting</TableCell>
                                                <TableCell>1 hour 15 minutes per page</TableCell>
                                                <TableCell>2 hours 30 minutes per page</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th">Argument; No Drafting</TableCell>
                                                <TableCell>1 hour 30 minutes per page</TableCell>
                                                <TableCell>3 hours per page</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th">Argument; Minimal Drafting</TableCell>
                                                <TableCell>2 hours per page</TableCell>
                                                <TableCell>4 hours per page</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th">Argument; Extensive Drafting</TableCell>
                                                <TableCell>2 hour 30 minutes per page</TableCell>
                                                <TableCell>5 hours per page</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th">Research; No Drafting</TableCell>
                                                <TableCell>3 hours per page</TableCell>
                                                <TableCell>6 hours per page</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th">Research; Minimal Drafting</TableCell>
                                                <TableCell>4 hours per page</TableCell>
                                                <TableCell>8 hours per page</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th">Research; Extensive Drafting</TableCell>
                                                <TableCell>5 hours per page</TableCell>
                                                <TableCell>10 hours per page</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <p id='discussion-calculation'>The Online Discussion Forum posting estimates are based on the work of Baird, Lamberson and Shaikh from "Student Course Time Estimator" <a href="https://ubcoapps.elearning.ubc.ca/time-estimator/" target="_blank">https://ubcoapps.elearning.ubc.ca/time-estimator/</a>. For the purposes of Discussion Forum posting calculations, we are assuming that the assigned requirement is for thoughtful and researched contributions. </p>
                                <ul>
                                    <li>By default, the average (Avg.) post length is based on the Reflection/Narrative, Minimal Drafting writing assignment estimate of 250 words per hour.</li>
                                    <li>By default, the average (Avg.) response length is based on half of a Reflection/Narrative, Minimal Drafting writing assignment estimate of 125 words per half an hour.</li>
                                </ul>
                                <h3>References</h3>
                                <p>Baird, D., Lamberson, M., & Shaikh, M. (n.d.). "Student Course Time Estimator". Retrieved March 22, 2023 from <a href="https://ubcoapps.elearning.ubc.ca/time-estimator/" target="_blank">https://ubcoapps.elearning.ubc.ca/time-estimator/</a>.</p>
                                <p>Barre, B., Brown, A., & Esarey, J. (n.d.). Workload Estimator 2.0. Retrieved March 22, 2023 from <a href="https://cat.wfu.edu/resources/tools/estimator2" target="_blank">https://cat.wfu.edu/resources/tools/estimator2</a>.</p>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion autoFocus className='no-print' onChange={(_, expanded) => expanded && trackEvent('accordion_expanded', { accordion_title: 'Credits and CC License' })}>
                            <AccordionSummary className='accordion-summary-background' expandIcon={<ExpandMoreIcon />} aria-controls="credits-and-license-panel">
                                <Typography>Credits and CC License</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <a rel="license" href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank"><img alt="Creative Commons License" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.
                                <p>Modified by Bonnie Johnston &amp; Arvin Rolos.</p>
                                <p>This app was inspired by and modified from "Student Course Time Estimator" <a href="https://ubcoapps.elearning.ubc.ca/time-estimator/" target="_blank">https://ubcoapps.elearning.ubc.ca/time-estimator/</a> created by Baird, Lamberson and Shaikh, which was modified from"Workload Estimator 2.0" <a href="https://cat.wfu.edu/resources/tools/estimator2/" target="_blank">https://cat.wfu.edu/resources/tools/estimator2/</a> created by Barre, Brown, and Esarey under a <a rel="license" href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.</p>
                                <p>Baird, D., Lamberson, M., &amp; Shaikh, M. (n.d.). "Student Course Time Estimator". Retrieved March 22, 2023 from <a href="https://ubcoapps.elearning.ubc.ca/time-estimator/" target="_blank">https://ubcoapps.elearning.ubc.ca/time-estimator/</a>.</p>
                                <p>Barre, B., Brown, A., &amp; Esarey, J. (n.d.). Workload Estimator 2.0. Retrieved March 22, 2023 from <a href="https://cat.wfu.edu/resources/tools/estimator2" target="_blank">https://cat.wfu.edu/resources/tools/estimator2</a>.</p>
                                {/* <p>Download Source Code</p> */}
                            </AccordionDetails>
                        </Accordion>

                    </Container>
                </Box>
                <Grid container spacing={2} id="footer" className="no-print">
                    <Grid className="cpt-contact" item xs={12} sm={6} md={6} lg={6} xl={6}>
                        <p>contact us at <Link href="mailto:courseproduction@bcit.ca?subject=Course-Workload-Estimator%3A%20" target="_blank" rel="noopener noreferrer">courseproduction@bcit.ca</Link></p>
                    </Grid>
                    <Grid className="ltc-link" item xs={12} sm={6} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                        <p>made by <Link href="https://www.bcit.ca/learning-teaching-centre/" target="_blank" rel="noopener noreferrer">BCIT LTC</Link></p>
                    </Grid>
                </Grid>
            </Box>
        </ThemeProvider>
    );
};

const AppWithAnalytics = () => (
    <AnalyticsProvider>
        <App />
    </AnalyticsProvider>
);

export default AppWithAnalytics;
