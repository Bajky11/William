import {Accordion, AccordionDetails, AccordionSummary, Typography} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export function CustomAccordion({heading, AccordionBody}) {
    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
            >
                <Typography>{heading}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {AccordionBody}
            </AccordionDetails>
        </Accordion>
    )
}