import React, { useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export function CustomAccordion({ heading, AccordionBody, defaultExpanded = false }) {
    const [expanded, setExpanded] = useState(defaultExpanded);

    const handleChange = () => {
        setExpanded(!expanded);
    };

    return (
        <Accordion expanded={expanded} onChange={handleChange}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
            >
                <Typography>{heading}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {AccordionBody}
            </AccordionDetails>
        </Accordion>
    );
}
