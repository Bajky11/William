import {Breadcrumbs, Typography} from "@mui/material";
import Link from '@mui/material/Link';
import {boo} from "./constants";

export function CustomBreadCrumbs({links = [], current = "Not found"}) {

    return (
        <Breadcrumbs aria-label="breadcrumb">
            {
                links.map((link, index) => {
                    return (
                        <Link
                            underline="hover"
                            color="inherit"
                            href={link.to}
                            key={index}
                        >
                            {link.label}
                        </Link>
                    )
                })
            }

            <Typography color="text.primary">{current}</Typography>
        </Breadcrumbs>
    );
}
