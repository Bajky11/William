import {useState} from "react";
import {Box, Tab, Tabs} from "@mui/material";

export function CustomTabs({data}) {
    const [value, setValue] = useState(data[0].value);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{width: '100%'}}>
            <Tabs
                value={value}
                onChange={handleChange}
                aria-label="secondary tabs example"
                textColor="secondary"

                variant="scrollable"
            >
                {
                    data.map(tab => (
                        <Tab
                            key={tab.value}
                            value={tab.value}
                            label={tab.headerName}
                            sx={{
                                backgroundColor: value === tab.value ? 'black' : 'white',
                                color: value === tab.value ? 'white' : 'black',
                                borderRadius: '4px 4px 0 0',
                            }}
                        />
                    ))
                }
            </Tabs>
            {
                data.find(tab => tab.value === value)?.render
            }
        </Box>
    );
}