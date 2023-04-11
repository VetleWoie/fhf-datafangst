import { Box, Drawer } from "@mui/material";
import { FC } from "react";
import {
  selectHaulsSearch,
  setHaulsSearch,
  useAppDispatch,
  useAppSelector,
} from "store";
import { GearFilter } from "./GearFilter";
import { MonthsFilter } from "./MonthsFilter";
import { SpecieFilter as SpeciesFilter } from "./SpeciesFilter";
import { LengthGroupFilter } from "./LengthGroupFilter";
import { YearsFilter } from "./YearsFilter";
import { VesselFilter } from "./VesselFilter";

export const FilterMenu: FC = () => {
  const haulsSearch = useAppSelector(selectHaulsSearch);
  const dispatch = useAppDispatch();

  return (
    <Box sx={{ height: "100%" }}>
      <Drawer
        variant="permanent"
        sx={{
          height: "100%",
          "& .MuiDrawer-paper": {
            p: 3,
            width: 500,
            position: "relative",
            boxSizing: "border-box",
            bgcolor: "primary.main",
            color: "white",
            flexShrink: 0,
            height: "100%",
          },
          "& .MuiOutlinedInput-root": { borderRadius: 0 },
          "& .MuiChip-filled": {
            color: "black",
            bgcolor: "secondary.main",
            borderRadius: 0,
          },
        }}
      >
        <Box
          sx={{
            width: "100%",
            "& .MuiChip-filled": {
              color: "black",
              bgcolor: "secondary.main",
              borderRadius: 0,
            },
            "& .MuiButtonBase-root": {
              borderRadius: 0,

              "&:hover": {
                borderRadius: 0,
              },
            },
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ width: "100%" }}>
              <YearsFilter
                value={haulsSearch?.years}
                onChange={(value) =>
                  dispatch(setHaulsSearch({ ...haulsSearch, years: value }))
                }
              />
            </Box>
            <Box sx={{ width: "100%" }}>
              <MonthsFilter
                value={haulsSearch?.months}
                onChange={(value) =>
                  dispatch(setHaulsSearch({ ...haulsSearch, months: value }))
                }
              />
            </Box>
          </Box>
        </Box>
        <GearFilter
          value={haulsSearch?.gearGroupIds}
          onChange={(value) =>
            dispatch(setHaulsSearch({ ...haulsSearch, gearGroupIds: value }))
          }
        />
        <SpecieFilter
          value={haulsSearch?.speciesGroupIds}
          onChange={(value) =>
            dispatch(setHaulsSearch({ ...haulsSearch, speciesGroupIds: value }))
          }
        />
        <LengthGroupFilter
          value={haulsSearch?.vesselLengthRanges}
          onChange={(value) =>
            dispatch(
              setHaulsSearch({ ...haulsSearch, vesselLengthRanges: value }),
            )
          }
        />
        <VesselFilter
          value={haulsSearch?.vessels}
          onChange={(value) =>
            dispatch(setHaulsSearch({ ...haulsSearch, vessels: value }))
          }
          useVirtualization
        />
      </Drawer>
    </Box>
  );
};
