import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { FC, useEffect } from "react";
import { selectEfficiency } from "store/efficiency/selectors";
import theme from "app/theme";

import {
  useAppDispatch,
  useAppSelector,
} from "store";
import { EfficiencyViewState } from "store/efficiency/state";
import { setSelectedEfficiency } from "store/efficiency/actions";

export const MyEfficiency: FC = () => {
  const dispatch = useAppDispatch();
  const efficiencyState = useAppSelector(selectEfficiency)

  function handleChange(newValue: EfficiencyViewState){
    dispatch(setSelectedEfficiency(newValue));
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
        value={efficiencyState}
        exclusive
        onChange={(_: React.MouseEvent<HTMLElement>, newValue: EfficiencyViewState) =>
          handleChange(newValue)
        }
        >
          <ToggleButton value={EfficiencyViewState.timePerDay}> Tidsforbruk per dag </ToggleButton>
          <ToggleButton value={EfficiencyViewState.distancePerDay}> Distanse per dag </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Box>
  );
};
