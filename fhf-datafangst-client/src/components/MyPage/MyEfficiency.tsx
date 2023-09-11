import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { FC, useEffect } from "react";
import { selectEfficiencies } from "store/efficiency/selectors";
import theme from "app/theme";

import {
  useAppDispatch,
  useAppSelector,
} from "store";
import { EfficiencyViewState } from "store/efficiency/state";
import { setSelectEfficiencies } from "store/efficiency/actions";

export const MyEfficiency: FC = () => {
  const dispatch = useAppDispatch();
  const efficiencyStates = useAppSelector(selectEfficiencies)

  function handleChange(newValue: EfficiencyViewState[]){
    //Do not allow no values chosen for efficiencies
    if (newValue.length != 0){
      dispatch(setSelectEfficiencies(newValue));
    }
  }

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
        value={efficiencyStates}
        onChange={(_: React.MouseEvent<HTMLElement>, newValue: EfficiencyViewState[]) =>
          handleChange(newValue)
        }
        >
          <ToggleButton value={EfficiencyViewState.timePerHour}> Tidsforbruk per time </ToggleButton>
          <ToggleButton value={EfficiencyViewState.distancePerHour}> Distanse per time</ToggleButton>
          <ToggleButton value={EfficiencyViewState.fishPerHour}> Fisk per time </ToggleButton>

        </ToggleButtonGroup>
      </Box>
    </Box>
  );
};
