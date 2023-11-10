import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { AppState } from "store/state";
import {
  clearBenchmarkData,
  getBenchmarkData,
  getBenchmarkOwnTrips,
  setBenchmarkDataSource,
  setBenchmarkHistoric,
  setBenchmarkModal,
  setBenchmarkPeriod
} from "./actions";
import { DateRange } from "components/MainMenu/SearchFilters/DateFilter"
import { Trip } from "generated/openapi";

export const benchmarkBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder
    .addCase(setBenchmarkModal, (state, action) => {
      state.benchmarkModal = action.payload;
    })
    .addCase(setBenchmarkHistoric, (state, action) => {
      state.benchmarkHistoric = action.payload.data;
    })
    .addCase(setBenchmarkDataSource, (state, action) => {
      state.benchmarkDataSource = action.payload;
    })
    .addCase(getBenchmarkData.fulfilled, (state, action) => {
      state.benchmarkTrips[action.payload[0].fiskeridirVesselId] =
        action.payload;
    })
    .addCase(getBenchmarkOwnTrips.fulfilled, (state, action) => {
      state.trips = action.payload;
      console.log("payload: ", action.payload)
      if (action.payload.length !== 0) {
        state.benchmarkPeriod = new DateRange(new Date(action.payload[action.payload.length - 1].start), new Date(action.payload[0].end))
      }
    })
    .addCase(clearBenchmarkData, (state, action) => {
      const tmp: Record<number, Trip[]> = {};
      Object.keys(state.benchmarkTrips)
        .filter(
          (fiskeridirId) => +fiskeridirId !== action.payload.fiskeridir.id,
        )
        .forEach((fiskeridirId) => {
          tmp[+fiskeridirId] = state.benchmarkTrips[+fiskeridirId];
        });
      state.benchmarkTrips = tmp;
    })
    .addCase(setBenchmarkPeriod, (state, action) => {
      state.benchmarkPeriod = action.payload
    });
