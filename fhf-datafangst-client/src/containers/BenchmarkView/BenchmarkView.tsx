import { Box } from "@mui/material";
import { BmHeader, BmHeaderMenuButtons, Header } from "components";
import { FC, useEffect, useState } from "react";

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

const HaulMenuArea = (props: any) => (
  <Box
    sx={{
      gridColumnStart: 3,
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
  return (
    <>
    <GridContainer>
      <HeaderTrack>
        <BmHeader/>
      </HeaderTrack>
      <HeaderButtonCell>
          <BmHeaderMenuButtons />
      </HeaderButtonCell>
      <MenuArea>
        whasts giubg ib
      </MenuArea>
    </GridContainer>
    <Box sx={{ height: "100vh", width: "100%", backgroundColor: "primary.main" }}>
      asdasd

    </Box>
    </>
  );
};
