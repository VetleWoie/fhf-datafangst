import { Box } from "@mui/material";
import { FC } from "react";
import {
  selectHaulsMatrixSearch,
  setHoveredFilter,
  setHaulsMatrixSearch,
  useAppDispatch,
  useAppSelector,
} from "store";
import { GearFilter } from "./GearFilter";
import { MonthsFilter } from "./MonthsFilter";
import { SpeciesFilter } from "./SpeciesFilter";
import { LengthGroupFilter } from "./LengthGroupFilter";
import { YearsFilter } from "./YearsFilter";
import { VesselFilter } from "./VesselFilter";
import { HaulsFilter } from "api";
import { Vessel } from "generated/openapi";

interface Props {
  selectedVessel?: Vessel;
}

export const Filters: FC<Props> = (props) => {
  const { selectedVessel } = props;
  const haulsSearch = useAppSelector(selectHaulsMatrixSearch);
  const dispatch = useAppDispatch();

  const onFilterHover = (filter: HaulsFilter) =>
    dispatch(setHoveredFilter(filter));

  return (
    <>
      <Box
        sx={{
          width: "100%",
          "& .MuiButtonBase-root": {
            borderRadius: 0,
            "&:hover": {
              borderRadius: 0,
            },
          },
        }}
      >
        <Box
          sx={{ display: "flex", justifyContent: "space-between" }}
          onMouseEnter={() => onFilterHover(HaulsFilter.Date)}
        >
          <Box sx={{ width: "100%" }}>
            <YearsFilter
              value={haulsSearch?.years}
              onChange={(value) =>
                dispatch(setHaulsMatrixSearch({ ...haulsSearch, years: value }))
              }
            />
          </Box>
          <Box sx={{ width: "100%" }}>
            <MonthsFilter
              value={haulsSearch?.months}
              onChange={(value) =>
                dispatch(
                  setHaulsMatrixSearch({ ...haulsSearch, months: value }),
                )
              }
            />
          </Box>
        </Box>
      </Box>
      <Box onMouseEnter={() => onFilterHover(HaulsFilter.GearGroup)}>
        <GearFilter
          value={haulsSearch?.gearGroupIds}
          onChange={(value) =>
            dispatch(
              setHaulsMatrixSearch({ ...haulsSearch, gearGroupIds: value }),
            )
          }
        />
      </Box>
      <Box onMouseEnter={() => onFilterHover(HaulsFilter.SpeciesGroup)}>
        <SpeciesFilter
          value={haulsSearch?.speciesGroupIds}
          onChange={(value) =>
            dispatch(
              setHaulsMatrixSearch({ ...haulsSearch, speciesGroupIds: value }),
            )
          }
        />
      </Box>
      <Box onMouseEnter={() => onFilterHover(HaulsFilter.VesselLength)}>
        <LengthGroupFilter
          value={haulsSearch?.vesselLengthRanges}
          onChange={(value) =>
            dispatch(
              setHaulsMatrixSearch({
                ...haulsSearch,
                vesselLengthRanges: value,
              }),
            )
          }
        />
      </Box>
      {!selectedVessel && (
        <Box onMouseEnter={() => onFilterHover(HaulsFilter.Vessel)}>
          <VesselFilter
            value={haulsSearch?.vessels}
            onChange={(value) =>
              dispatch(setHaulsMatrixSearch({ ...haulsSearch, vessels: value }))
            }
            useVirtualization
          />
        </Box>
      )}
    </>
  );
};