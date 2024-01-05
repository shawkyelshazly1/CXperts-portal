import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function ErrorsAccordion({ errors }) {
	return (
		<div>
			<h1 className="font-semibold mb-2 text-lg ">Failed Errors</h1>
			{errors.map((error) => (
				<Accordion key={error.index}>
					<AccordionSummary
						expandIcon={<ExpandMoreIcon />}
						aria-controls="panel2a-content"
						id="panel2a-header"
					>
						<Typography>
							Employee Index:{" "}
							<span className="font-semibold">{error.index}</span>
						</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<ul className="list-disc px-4">
							{error.errors.map((error, idx) => (
								<li key={idx} className="text-red-500 text-lg">
									{error}
								</li>
							))}
						</ul>
					</AccordionDetails>
				</Accordion>
			))}
		</div>
	);
}
