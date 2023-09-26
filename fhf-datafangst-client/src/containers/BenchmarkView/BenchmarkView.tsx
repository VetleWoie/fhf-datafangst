import { Box, Snackbar } from "@mui/material";
import { BenchmarkHeader, BenchmarkHeaderMenuButtons, BenchmarkMenu} from "components";
import { FC, useEffect, useState } from "react";
import {
  selectTripDetailsOpen, useAppDispatch, useAppSelector,
} from "store";
import { selectEfficiency, selectEfficiencyDetailOpen } from "store/efficiency";

const GridContainer = (props: any) => (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "500px 1fr 500px",
        gridTemplateRows: "48px 56px 1fr 100px",
        position: "absolute",
        width: "100%",
        height: "100%",
      }}
    >
      {props.children}
    </Box>
  );

const HeaderTrack = (props: any) => (
  <Box
    sx={{
      gridColumnStart: 1,
      gridColumnEnd: 4,
      gridRowStart: 1,
      gridRowEnd: 2,
    }}
  >
    {props.children}
  </Box>
);

const HeaderButtonCell = (props: any) => (
  <Box
    sx={{
      gridColumnStart: 1,
      gridColumnEnd: 2,
      gridRowStart: 1,
      gridRowEnd: 2,
    }}
  >
    {props.children}
  </Box>
);

const MenuArea = (props: any) => (
  <Box
    sx={{
      gridColumnStart: 1,
      gridColumnEnd: 2,
      gridRowStart: 2,
      gridRowEnd: 5,
      display: "flex",
      flexDirection: "column",
      overflowY: "auto",
    }}
  >
    {props.children}
  </Box>
);

const HaulMenuArea = (props: { open: boolean; children: any }) => (
  <Box
    sx={{
      gridColumnStart: props.open ? 2 : 3,
      gridColumnEnd: 4,
      gridRowStart: 2,
      gridRowEnd: 5,
      display: "flex",
      flexDirection: "column",
    }}
  >
    {props.children}
  </Box>
);

const FilterButtonArea = (props: { open: boolean; children: any }) => (
  <Box
    sx={{
      gridColumnStart: 2,
      gridColumnEnd: props.open ? 2 : 4,
      gridRowStart: 2,
      gridRowEnd: 3,
      display: "flex",
      justifyContent: "flex-end",
    }}
  >
    {props.children}
  </Box>
);

const MapAttributionsArea = (props: { open: boolean; children: any }) => (
  <Box
    sx={{
      gridColumnStart: 2,
      gridColumnEnd: props.open ? 3 : 4,
      gridRowStart: 4,
      gridRowEnd: 5,
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
    }}
  >
    {props.children}
  </Box>
);

const TimeSliderArea = (props: { open: boolean; children: any }) => (
  <Box
    sx={{
      gridColumnStart: 2,
      gridColumnEnd: props.open ? 2 : 4,
      gridRowStart: 4,
      gridRowEnd: 5,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
    }}
  >
    {props.children}
  </Box>
);

const CenterArea = (props: { open: boolean; children: any }) => (
  <Box
    sx={{
      gridColumnStart: 2,
      gridColumnEnd: props.open ? 2 : 4,
      gridRowStart: 2,
      gridRowEnd: 5,
      display: "flex",
      justifyContent: "flex-end",
    }}
  >
    {props.children}
  </Box>
);
  
export const BenchmarkView: FC = () => {
  const dispatch = useAppDispatch();

  return (
    <>
        <GridContainer>
        <HeaderTrack>
          <BenchmarkHeader />
        </HeaderTrack>
        <HeaderButtonCell>
            <BenchmarkHeaderMenuButtons />
        </HeaderButtonCell>
        <MenuArea>
          <BenchmarkMenu    />
        </MenuArea>

        </GridContainer>
        <Box>
        </Box>
    </>
  );
};
