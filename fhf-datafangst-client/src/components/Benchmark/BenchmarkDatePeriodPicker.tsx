
import { Box, Typography } from "@mui/material";
import { FC, useState } from "react";

import { useNavigate } from "react-router-dom";
import { DateRange } from "../MainMenu/SearchFilters/DateFilter"
import { DateFilter } from "../MainMenu/SearchFilters/DateFilter";

const DatePickerFunc = (props: any) => {
  // Define your value and onChange functions here
  const [value, setValue] = useState<DateRange>(/* initial value here */);

  const onChange = (newDateRange: DateRange | undefined) => {
    // Handle the new date range here
    setValue(newDateRange);
  };

  return <DateFilter value={value} onChange={onChange} />;
};

const CalenderContainer = (props: any) => (
  <Box
    sx={{
    backgroundColor: "white",
    width: "20%"
  }}
  >
    {props.children}
  </Box>
);

interface Props {
  value?: DateRange;
  onChange: (_?: DateRange) => void;
}

export const DatePeriodPicker: FC<Props> = (props) => {

    return (
        <Box>
          <CalenderContainer>
            <DatePickerFunc></DatePickerFunc>
          </CalenderContainer>
          </Box>
    )
    };