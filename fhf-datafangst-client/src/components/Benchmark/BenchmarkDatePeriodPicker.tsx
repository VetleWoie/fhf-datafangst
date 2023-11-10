
import { Box, SxProps, Typography } from "@mui/material";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DateRange } from "../MainMenu/SearchFilters/DateFilter"
import { DateFilter } from "../MainMenu/SearchFilters/DateFilter";
import { getTrips, selectBwUserProfile, selectTrips, selectVesselsByCallsign, useAppDispatch, useAppSelector, selectBenchmarkPeriod } from "store";
import { Ordering, TripSorting } from "generated/openapi";
import { selectBenchmarkNumHistoric } from "store/benchmark";
import { setBenchmarkPeriod, getBenchmarkOwnTrips } from "store/benchmark";

// TODO:
// - Fiks perioder uten turer.
// - Paging limit på hvor mange turer man kan få ut på requesten fra backend.
// Fiks at man kan skrive inn i datofeltet uten at den referesher før man er ferdig.

interface datePickerProps {
  period?: DateRange;
  existingTrips: boolean;
  sx?: SxProps;
}

export const DatePeriodPicker = (props: datePickerProps) => {
  const dispatch = useAppDispatch()
  const benchmarkHistoric = useAppSelector(selectBenchmarkNumHistoric);
  const profile = useAppSelector(selectBwUserProfile);
  const vesselInfo = profile?.vesselInfo;
  const vessels = useAppSelector(selectVesselsByCallsign);
  const vessel = vesselInfo?.ircs ? vessels[vesselInfo.ircs] : undefined;
  let datePeriod = useAppSelector(selectBenchmarkPeriod)
  if (!vessel) {
    return <></>
  };


  const onChange = (datePeriod: DateRange | undefined) => {
    if (!datePeriod) {
      return
    }
    dispatch(setBenchmarkPeriod(datePeriod));

    dispatch(
      getBenchmarkOwnTrips({
        vessels: [vessel],
        sorting: [TripSorting.StopDate, Ordering.Desc],
        limit: benchmarkHistoric,
        dateRange: datePeriod,
        offset: 0,
      }))
      console.log("onChange newDateRange: ", datePeriod.start, datePeriod.end)
  };

  return (
    <Box>
      <CalenderContainer existingTrips = {props.existingTrips}>
        <DateFilter value={datePeriod} onChange={onChange} />
      </CalenderContainer>
    </Box>
  )
};

interface CalenderContainerProps {
  existingTrips: Boolean;
  children: any;
}

const CalenderContainer = (props: CalenderContainerProps) => (
  <Box
    sx={{
      backgroundColor: "primary.main",
      color: "white",
      width: props.existingTrips ? "20%" : "30%"
    }}>
    {props.children}
  </Box>
);