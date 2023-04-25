import { Box, CircularProgress, Drawer } from "@mui/material";
import { FC } from "react";
import { Filters } from "components";
import { selectHaulsMatrixLoading, useAppSelector } from "store";

export const FilterMenu: FC = () => {
  const matrixLoading = useAppSelector(selectHaulsMatrixLoading);

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
        {matrixLoading ? (
          <Box
            sx={{
              display: "flex",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            <CircularProgress color="inherit" disableShrink />
          </Box>
        ) : (
          <Filters />
        )}
      </Drawer>
    </Box>
  );
};
