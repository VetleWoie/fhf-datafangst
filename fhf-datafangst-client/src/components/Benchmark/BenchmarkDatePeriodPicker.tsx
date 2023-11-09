
import { Box, SxProps, Typography } from "@mui/material";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DateRange } from "../MainMenu/SearchFilters/DateFilter"
import { DateFilter } from "../MainMenu/SearchFilters/DateFilter";
import { getTrips, selectBwUserProfile, selectTrips, selectVesselsByCallsign, useAppDispatch, useAppSelector, selectBenchmarkPeriod } from "store";
import { Ordering, TripSorting } from "generated/openapi";
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
  const profile = useAppSelector(selectBwUserProfile);
  const vesselInfo = profile?.vesselInfo;
  const vessels = useAppSelector(selectVesselsByCallsign);
  const vessel = vesselInfo?.ircs ? vessels[vesselInfo.ircs] : undefined;
  const datePeriod = useAppSelector(selectBenchmarkPeriod)
  console.log("props.period: ", props.period)
  if (!vessel) {
    return <></>
  };


  const onChange = (newDateRange: DateRange | undefined) => {
    if (!newDateRange) {
      return
    }

    dispatch(
      getBenchmarkOwnTrips({
        vessels: [vessel],
        sorting: [TripSorting.StopDate, Ordering.Desc],
        dateRange: newDateRange
      }))
    console.log("onChange newDateRange: ", newDateRange)
    dispatch(setBenchmarkPeriod(newDateRange));
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
      width: props.existingTrips ? "20%" : "100%"
    }}>
    {props.children}
  </Box>
);