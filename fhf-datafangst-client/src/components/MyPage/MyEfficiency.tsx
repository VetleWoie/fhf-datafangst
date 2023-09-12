import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { FC, ReactElement, useEffect } from "react";
import { selectEfficiency, selectEfficiencyDuration } from "store/efficiency/selectors";
import theme from "app/theme";

import {
  useAppDispatch,
  useAppSelector,
} from "store";
import { EfficiencyDurationState, EfficiencyViewState } from "store/efficiency/state";
import { setSelectedEfficiency, setSelectedEfficiencyDuration } from "store/efficiency/actions";

export const MyEfficiency: FC = () => {
  const dispatch = useAppDispatch();
  const efficiencyState = useAppSelector(selectEfficiency)
  const efficiencyDurationState = useAppSelector(selectEfficiencyDuration)
  console.log(efficiencyState)


  function handleChange(newValue: EfficiencyViewState | undefined){
    //Do not allow no values chosen for efficiencies
    console.log(newValue)
    dispatch(setSelectedEfficiency(newValue));
    if (!newValue){
      dispatch(setSelectedEfficiencyDuration(undefined))
    }else{
      dispatch(setSelectedEfficiencyDuration([EfficiencyDurationState.day]))
    }
  }

  function handleDurationChange(newValue: EfficiencyDurationState[]){
    //Do not allow no values chosen for efficiencies
    console.log(newValue)
    if(newValue.length > 0){
      dispatch(setSelectedEfficiencyDuration(newValue));
    }
  }


  let durationButtons : ReactElement[] = [];

  Object.keys(EfficiencyDurationState).forEach((duration)=>{
    durationButtons.push(
      <ToggleButton key={duration} value={duration}> {duration} </ToggleButton>
    )
  })
  return (
    <Box sx={{ height: "100%", px: 2.5, py: 1 }}>
      <Box
        sx={{
          pb: 1.5,
          pt: 1,
          "& .MuiToggleButtonGroup-grouped": {
            borderRadius: 0,
            color: "text.secondary",
            borderColor: theme.palette.grey.A100,
          },
          "& .MuiToggleButton-root": {
            "&.Mui-selected": {
              backgroundColor: "secondary.main",
              color: "white",
              "&:hover": { bgcolor: "secondary.main" },
            },
            "&:hover": { bgcolor: "secondary.main" },
          },
        }}
      >
      <ToggleButtonGroup
        size="small"
        exclusive
        value={efficiencyState}
        onChange={(_: React.MouseEvent<HTMLElement>, newValue: EfficiencyViewState) =>
          handleChange(newValue)
        }
        >
          <ToggleButton value={EfficiencyViewState.timePerHour}> Tidsforbruk per time </ToggleButton>
          <ToggleButton value={EfficiencyViewState.distancePerHour}> Distanse per time</ToggleButton>
          <ToggleButton value={EfficiencyViewState.fishPerHour}> Fisk per time </ToggleButton>

        </ToggleButtonGroup>
      </Box>
      <Box
        sx={{
          pb: 1.5,
          pt: 1,
          "& .MuiToggleButtonGroup-grouped": {
            borderRadius: 0,
            color: "text.secondary",
            borderColor: theme.palette.grey.A100,
          },
          "& .MuiToggleButton-root": {
            "&.Mui-selected": {
              backgroundColor: "secondary.main",
              color: "white",
              "&:hover": { bgcolor: "secondary.main" },
            },
            "&:hover": { bgcolor: "secondary.main" },
          },
        }}
      >
      <ToggleButtonGroup
        size="small"
        value={efficiencyDurationState}
        onChange={(_: React.MouseEvent<HTMLElement>, newValue: EfficiencyDurationState[]) =>
          handleDurationChange(newValue)
        }
        >
          {durationButtons}
        </ToggleButtonGroup>
      </Box>
    </Box>
  );
};
