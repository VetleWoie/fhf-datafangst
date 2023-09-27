import { FC } from "react"
import { useAppSelector, useAppDispatch } from "store";
import { selectEfficiency, selectEfficiencyDetailOpen, setSelectedEfficiency, setSelectedEfficiencyDetailOpen } from "store/efficiency";
import {
  Box,
  Button,
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

import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import ArrowForwardIosNewRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import { BenchmarkView } from "./BenchmarkView";

export const EfficiencyMenu: FC = () => {
  const efficiency = useAppSelector(selectEfficiency);
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectBwUserProfile);

  const vesselInfo = profile?.vesselInfo;
  const vessels = useAppSelector(selectVesselsByCallsign);
  const vessel = vesselInfo?.ircs ? vessels[vesselInfo.ircs] : undefined;
  const open = useAppSelector(selectEfficiencyDetailOpen)



  if (!efficiency) {
    return <></>;
  }

  return (
    <Box
      sx={{
        height: "100%",
        marginTop: "auto",
        display: "flex",
      }}
    >
      <Box sx={{
        height: "100%",
        backgroundColor: "primary.main",
        display: "flex",
        justifyContent: "center",
        color: "white",
        zIndex: 5000,
      }}
      >
        <IconButton
          sx={{
            width: "100%",
            color: "white",
          }}
          onClick={() => {
            dispatch(setSelectedEfficiencyDetailOpen(!open))
          }}
        >
          {open ? <ArrowForwardIosNewRoundedIcon /> : <ArrowBackIosNewRoundedIcon />}

        </IconButton>

      </Box>
      {open ? <Box

        sx={{
          height: "100%",
          width: "100%",
          zIndex: 5000,
          backgroundColor : "primary.main",
          color : "white",
        }}
        >

        <BenchmarkView />

      </Box> :
      
      <Drawer
        sx={{
          height: "100%",
          width: "100%",
          zIndex: 5000,
          flexShrink: 1,

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
          <Box sx={{ marginLeft: 2 }}>
            <Typography variant="h5">{efficiency}</Typography>
            <Typography color="secondary.light" variant="h6">
              {toTitleCase(
                vessel?.fiskeridir.name ?? "Ukjent",
              )}
            </Typography>
          </Box>
          <Box sx={{ marginLeft: "auto" }}>
            <IconButton
              onClick={() => {
                dispatch(setSelectedEfficiency(undefined));
              }}
            >
              <CloseSharpIcon sx={{ color: "white" }} />
            </IconButton>
          </Box>
        </Box>
        <Divider sx={{ bgcolor: "text.secondary", mb: 2, mx: 4 }} />
        <EfficiencyGauge />
        <Divider sx={{ bgcolor: "text.secondary", mb: 2, mx: 4 }} />
        <EfficiencyLeaderboard />
      </Drawer>

     }
    </Box>
  );
}