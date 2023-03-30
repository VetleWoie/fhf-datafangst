import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import * as Api from "api";
import { Haul } from "generated/openapi";

export const getAis = createAsyncThunk("ais/getAis", Api.getTrack);
export const getHaulAis = createAction<Haul | undefined>("ais/getHaulAis");
