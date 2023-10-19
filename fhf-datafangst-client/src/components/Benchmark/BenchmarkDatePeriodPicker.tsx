
import { Box, Typography } from "@mui/material";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DateRange } from "../MainMenu/SearchFilters/DateFilter"
import { DateFilter } from "../MainMenu/SearchFilters/DateFilter";
import { getTrips, selectBwUserProfile, selectTrips, selectVesselsByCallsign, useAppDispatch, useAppSelector } from "store";
import { Ordering, TripSorting } from "generated/openapi";
import { setBenchmarkPeriod } from "store/benchmark";

// TODO:
// - Fiks perioder uten turer.
// - Paging limit på hvor mange turer man kan få ut på requesten fra backend.
// Fiks at man kan skrive inn i datofeltet uten at den referesher før man er ferdig.

interface datePickerProps {
  period: DateRange;
}

export const DatePeriodPicker = (props: datePickerProps) => {
  const dispatch = useAppDispatch()
  const profile = useAppSelector(selectBwUserProfile);
  const vesselInfo = profile?.vesselInfo;
  const vessels = useAppSelector(selectVesselsByCallsign);
  const vessel = vesselInfo?.ircs ? vessels[vesselInfo.ircs] : undefined;
  const trips = useAppSelector(selectTrips)

  if (!vessel || !trips) {
    return <></>
  };

  const [value, setValue] = useState<DateRange>(
    props.period
    );


  const onChange = (newDateRange: DateRange | undefined) => {
    console.log("CONSOLE LOG ON CHANGE")
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
    dispatch(setBenchmarkPeriod(newDateRange));
  };

  return (
    <Box>
      <CalenderContainer>
        <DateFilter value={value} onChange={onChange} />;
      </CalenderContainer>
    </Box>
  )
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