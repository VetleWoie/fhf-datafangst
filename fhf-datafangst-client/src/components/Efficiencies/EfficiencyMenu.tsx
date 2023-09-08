import { FC } from "react"
import { useAppSelector, useAppDispatch } from "store";
import { selectEfficiencies, setSelectEfficiencies } from "store/efficiency";
import {
    Box,
    Divider,
    Drawer,
    IconButton,
    styled,
    SvgIcon,
    Typography,
  } from "@mui/material";
import { EfficiencyGauge } from "./EfficiencyGauge";
import { toTitleCase } from "utils";
import { AllInclusiveSharp } from "@mui/icons-material";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import AllInclusiveSharpIcon from "@mui/icons-material/AllInclusiveSharp";
import SpeedIcon from '@mui/icons-material/Speed';
import {
  selectBwUserProfile,
  selectVesselsByCallsign,
 } from "store";
import { EfficiencyLeaderboard } from "./EfficiencyLeaderboard";


export const EfficiencyMenu: FC = () => {
  const efficiency = useAppSelector(selectEfficiencies);
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectBwUserProfile);

  const vesselInfo = profile?.vesselInfo;
  const vessels = useAppSelector(selectVesselsByCallsign);
  // const vessel = vesselInfo?.ircs ? vessels[vesselInfo.ircs] : undefined;
  
  const vessel = vessels["LCOE"]
  console.log(vessel)

  if(!efficiency){
    return <></>;
  }

  return (
  <Box
  sx={{
    height: "100%",
    marginTop: "auto",
  }}
>
  <Drawer
    sx={{
      height: "100%",
      zIndex: 5000,
      flexShrink: 0,
      "& .MuiDrawer-paper": {
        position: "relative",
        backgroundColor: "primary.main",
      },
    }}
    open
    variant="persistent"
    anchor="right"
  >
    <Box
      sx={{
        display: "flex",
        py: 3,
        px: 2.5,
        backgroundColor: "primary.main",
        color: "white",
      }}
    >
      <SpeedIcon
        width="42"
        height="42"
        sx={{ alignSelf: "center" }}
      />
      <Box sx={{ marginLeft: 2}}>
        <Typography variant="h5">Effektivitet</Typography>
        <Typography color="secondary.light" variant="h6">
          {toTitleCase(
             vessel?.fiskeridir.name ?? "Ukjent",
          )}
        </Typography>
      </Box>
      <Box sx={{ marginLeft: "auto" }}>
        <IconButton
          onClick={() => {
            dispatch(setSelectEfficiencies(undefined));
          }}
        >
          <CloseSharpIcon sx={{ color: "white" }} />
        </IconButton>
      </Box>
    </Box>
    <Divider sx={{ bgcolor: "text.secondary", mb: 2, mx: 4 }} />
    <EfficiencyGauge/>
    <Divider sx={{ bgcolor: "text.secondary", mb: 2, mx: 4 }} />
    <EfficiencyLeaderboard/>
  </Drawer>
</Box>
);
}