import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import * as Api from "api";
import { HaulsArgs } from "api/haulsApi";
import { HaulsFilter } from "models";

export const getHauls = createAsyncThunk("haul/getHauls", Api.getHauls);

export const getHaulsGrid = createAsyncThunk(
  "haul/getHaulsGrid",
  Api.getHaulsGrid,
);

export const setHaulsSearch = createAction<HaulsArgs>("haul/setHaulsSearch");

export const setHaulsFilter = createAction<HaulsFilter>("haul/setHaulsFilter");
