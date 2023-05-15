import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import theme from "app/theme";
import { ListboxComponent, StyledPopper } from "components";
import { Vessel } from "generated/openapi";
import { FC, useMemo } from "react";
import { selectVesselsByFiskeridirId, useAppSelector } from "store";
import { toTitleCase } from "utils";
import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";

interface Props {
  value?: Vessel[];
  onChange: (vessel?: Vessel[]) => void;
  useVirtualization?: boolean;
}

export const VesselFilter: FC<Props> = (props) => {
  const { value, onChange, useVirtualization } = props;
  const vesselsMap = useAppSelector(selectVesselsByFiskeridirId);
  const vessels = Object.values(vesselsMap);
  const options = useMemo(
    () =>
      vessels.sort((a, b) =>
        (a.fiskeridir?.name ?? "Ukjent").localeCompare(
          b.fiskeridir?.name ?? "Ukjent",
          "no",
        ),
      ),
    [vessels],
  );

  return (
    <>
      <Typography sx={{ pb: 1, pt: 2 }} fontWeight="bold">
        Fartøy
      </Typography>
      <Autocomplete
        sx={{
          "& .MuiButtonBase-root": {
            borderRadius: 0,

            "&:hover": {
              borderRadius: 0,
            },
          },
        }}
        size="small"
        multiple
        limitTags={3}
        ChipProps={{ deleteIcon: <DisabledByDefaultIcon /> }}
        PopperComponent={StyledPopper}
        ListboxComponent={useVirtualization ? ListboxComponent : undefined}
        disablePortal
        disableListWrap
        onKeyDown={(e) => e.stopPropagation()}
        value={value ?? []}
        onChange={(_: any, vessels: Vessel[] | null) =>
          onChange(vessels?.length ? vessels : undefined)
        }
        options={options}
        getOptionLabel={(option: Vessel) =>
          toTitleCase(option?.fiskeridir?.name ?? "Ukjent")
        }
        renderInput={(params: any) => <TextField {...params} />}
        renderOption={(props: any, option: Vessel) => (
          <li
            {...props}
            key={option.fiskeridir.id}
            title={
              option.fiskeridir.name && option.fiskeridir.name.length > 31
                ? option.fiskeridir.name
                : undefined
            }
          >
            <Box sx={{ display: "flex" }}>
              <Box
                sx={{
                  m: "auto",
                  display: "flex",
                  justifyContent: "center",
                  color: "secondary.main",
                }}
              >
                <DirectionsBoatIcon
                  fill={theme.palette.primary.light}
                  width="30"
                  height="30"
                />
              </Box>
              <Box sx={{ ml: 2 }}>
                <Typography variant="body2" noWrap sx={{ width: 210 }}>
                  {toTitleCase(option?.fiskeridir.name ?? "Ukjent")}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {option.fiskeridir.registrationId}
                </Typography>
              </Box>
            </Box>
          </li>
        )}
      />
    </>
  );
};