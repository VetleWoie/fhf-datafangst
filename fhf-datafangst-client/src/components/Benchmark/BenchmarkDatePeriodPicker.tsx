
import { Box, Typography } from "@mui/material";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DateRange } from "../MainMenu/SearchFilters/DateFilter"
import { DateFilter } from "../MainMenu/SearchFilters/DateFilter";
import { getTrips, selectBwUserProfile, selectVesselsByCallsign, useAppDispatch, useAppSelector } from "store";
import { Ordering, TripSorting } from "generated/openapi";

// TODO:
// Hente ut at datoen for turene står i datofeltet
// - Fiks perioder uten turer.
// - Paging limit på hvor mange turer man kan få ut på requesten fra backend.
// Fiks at man kan skrive inn i datofeltet uten at den referesher før man er ferdig.
// Huske datoen som har blitt skrevet inn



const DatePickerFunc = (props: any) => {
  // Define your value and onChange functions here
  const [value, setValue] = useState<DateRange>(/* initial value here */);

  const dispatch = useAppDispatch()
  const profile = useAppSelector(selectBwUserProfile);
  const vesselInfo = profile?.vesselInfo;
  const vessels = useAppSelector(selectVesselsByCallsign);
  const vessel = vesselInfo?.ircs ? vessels[vesselInfo.ircs] : undefined;

  if (!vessel) {
    return <></>
  };


  const onChange = (newDateRange: DateRange | undefined) => {
    if (!newDateRange) {
      return
    }

    dispatch(
      getTrips({
        vessels: [vessel],
        sorting: [TripSorting.StopDate, Ordering.Desc],
        offset: 0,
        limit: 50,
        dateRange: newDateRange
      }))



    setValue(newDateRange);
  };

  return <DateFilter value={value} onChange={onChange} />;
};

const CalenderContainer = (props: any) => (
  <Box
    sx={{
    backgroundColor: "primary.main",
    color: "white",
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