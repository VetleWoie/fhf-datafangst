import { HaulState, initialHaulState } from "./haul";
import { FishmapState, initialFishmapState } from "./fishmap";
import { initialSpeciesState, SpeciesState } from "./species";
import { VesselState, initialVesselState } from "./vessel";
import { GearState, initialGearState } from "./gear";
import { AisState, initialAisState } from "./ais";
import { initialTripState, TripState } from "./trip";
import { initialVmsState, VmsState } from "./vms";
import { TrackState, initialTrackState } from "./track";
import { FiskInfoProfile } from "models";
import { User } from "oidc-react";
import {
  FishingFacilityState,
  initialFishingFacilitiesState,
} from "./fishingFacility";
import { initialUserState, UserState } from "./user";
import { LandingState, initialLandingState } from "./landing";
import { WeatherState, initialWeatherState } from "./weather";
import { BenchmarkState, initialBenchmarkState } from "./benchmark";

export enum MenuViewState {
  Overview = "overview",
  MyPage = "mypage",
  Trips = "trips",
  Benchmark = "benchmark",
}

export enum MatrixToggle {
  Haul,
  Landing,
}

export interface BaseState {
  error: boolean;
  isLoggedIn: boolean;
  viewState: MenuViewState;
  bwProfile?: FiskInfoProfile;
  authUser?: User;
  matrixToggle: MatrixToggle;
  tripFiltersOpen: boolean;
  tripDetailsOpen: boolean;
}

const initialBaseState: BaseState = {
  error: false,
  isLoggedIn: false,
  bwProfile: undefined,
  viewState: MenuViewState.Overview,
  authUser: undefined,
  matrixToggle: MatrixToggle.Haul,
  tripFiltersOpen: false,
  tripDetailsOpen: false,
};

export interface AppState
  extends BaseState,
    FishmapState,
    VesselState,
    HaulState,
    GearState,
    AisState,
    TripState,
    VmsState,
    TrackState,
    FishingFacilityState,
    UserState,
    LandingState,
    WeatherState,
    SpeciesState,
    BenchmarkState {}

export const initialAppState: AppState = {
  ...initialBaseState,
  ...initialFishmapState,
  ...initialVesselState,
  ...initialHaulState,
  ...initialGearState,
  ...initialAisState,
  ...initialTripState,
  ...initialVmsState,
  ...initialTrackState,
  ...initialFishingFacilitiesState,
  ...initialSpeciesState,
  ...initialUserState,
  ...initialLandingState,
  ...initialWeatherState,
  ...initialBenchmarkState,
};
