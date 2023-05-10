import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import * as Api from "api";
import { Trip } from "generated/openapi";

export const getTrips = createAsyncThunk("trip/getTrips", Api.getTrips);

export const getHaulTrip = createAsyncThunk(
  "trip/getHaulTrip",
  Api.getTripFromHaul,
);

export const setSelectedTrip = createAction<Trip | undefined>(
  "trip/setSelectedTrip",
);

export const setTripsSearch = createAction<Api.TripsArgs>(
  "trip/setTripsSearch",
);

export const paginateTripsSearch = createAction<{
  offset: number;
  limit: number;
}>("trip/paginateTripsSearch");
