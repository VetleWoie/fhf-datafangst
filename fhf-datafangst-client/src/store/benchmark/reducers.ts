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
import { createReducer, createAction, current } from '@reduxjs/toolkit'

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
      if (action.meta.arg.offset === 0) {
        state.trips = [];
      }
      state.trips = state.trips?.concat(action.payload);
      if (action.payload.length === (action.meta.arg.limit ?? state.benchmarkNumHistoric)) {
        (action as any).asyncDispatch(getBenchmarkOwnTrips({
           ...action.meta.arg,
          offset: action.meta.arg.offset! + state.benchmarkNumHistoric,
         }),
         );
       };
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
