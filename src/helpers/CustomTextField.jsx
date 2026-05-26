import React, { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import HelpIcon from '@mui/icons-material/Help';
import Collapse from '@mui/material/Collapse';
import { useTrackEvent } from '../analytics/AnalyticsContext';

export default function CustomTextField(props) {
    const trackEvent = useTrackEvent();
    const [customState, setCustomState] = useState(props.defaultState);
    const [isError, setIsError] = useState(false);
    const [clicked, setClicked] = React.useState(false);
    const optionalProps = {
        ...(props.fieldType != undefined && { type: props.fieldType }),
        ...(props.inputProps != undefined && { InputProps: props.inputProps }),
        ...(props.selectContent != undefined && { select: true }),

    };
    const selectedItem = props.selectContent && props.selectContent.find(item => item.value === customState);

    const handleCustomState = (event) => {
        const newInputValue = event.target.value;
        const numRegex = /^(?:\d+\.\d*|\.\d+|\d+)$/;
        const isNumber = numRegex.test(newInputValue);
        if (props.fieldType === 'number') {
            if (isNumber) {
                setIsError(false);
                setCustomState(newInputValue);
            } else {
                setIsError(true);
                event.target.value = customState;
            }
        } else {
            setCustomState(newInputValue);
            if (props.selectContent) {
                const selected = props.selectContent.find(item => item.value === newInputValue);
                trackEvent('activity_selected', {
                    activity_name: selected ? selected.text : String(newInputValue),
                    activity_index: newInputValue,
                });
            }
        }
    };
    const handleClick = () => {
        setClicked((prev) => !prev);
    };

    useEffect(() => {
        props.updateState(customState);
    }, [customState]);

    return (
        <div className='custom-textfield'>
            <Stack direction="row" spacing={0.5}>
                <TextField fullWidth size="small" variant="outlined" label={props.fieldLabel} value={customState} onChange={handleCustomState} {...optionalProps} error={isError} helperText={isError ? "Only numbers are allowed including decimals. Use the up/down arrow button if you want to use zero (0) or zero with decimal (0.5)." : ""}>
                    {props.selectContent ?
                        props.selectContent.map((item) => (
                            <MenuItem key={'select-' + item.value} sx={{ whiteSpace: 'normal' }} value={item.value}>{item.text}</MenuItem>
                        )) : null
                    }
                </TextField>

                {props.collapseContent ?
                    <HelpIcon onClick={handleClick} sx={{ color: "#00a69d" }} fontSize="small" className='help-icon' /> : <HelpIcon sx={{ visibility: "hidden" }} fontSize="small" className='help-icon' />
                }
            </Stack>

            {props.collapseContent ?
                <Collapse in={clicked} timeout="auto" className='collapse-content'>
                    {props.collapseContent}
                </Collapse> : null
            }

        </div>
    );
}
