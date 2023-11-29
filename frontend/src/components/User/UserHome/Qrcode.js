import React from 'react'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import image1 from "./img/1.png";
import image2 from "./img/2.png";
import image3 from "./img/3.png";

function Qrcode() {
  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Eagle Point</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <img src={image1} style={{height:'200px',width:'200px'}}/>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>UNT Union</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <img src={image2} style={{height:'200px',width:'200px'}}/>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>Parrot View</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <img src={image3} style={{height:'200px',width:'200px'}}/>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

export default Qrcode;