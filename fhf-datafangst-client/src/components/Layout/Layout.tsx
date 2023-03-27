import React, { ReactNode, useEffect } from "react";
import { Box } from "@mui/system";
import {
  checkLoggedIn,
  getGear,
  getGearGroups,
  getGearMainGroups,
  getSpecies,
  getSpeciesFao,
  getSpeciesFiskeridir,
  getSpeciesGroups,
  getSpeciesMainGroups,
  getVessels,
  setHaulsSearch,
  useAppDispatch,
} from "store";
import { getMonth, getYear } from "date-fns";

interface Props {
  children: ReactNode;
}

export const Layout: React.FC<Props> = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkLoggedIn());
    dispatch(
      setHaulsSearch({
        months: [getMonth(new Date())],
        years: [getYear(new Date())],
      }),
    );
    dispatch(getVessels());
    dispatch(getGear());
    dispatch(getGearGroups());
    dispatch(getGearMainGroups());
    dispatch(getSpecies());
    dispatch(getSpeciesFao());
    dispatch(getSpeciesFiskeridir());
    dispatch(getSpeciesGroups());
    dispatch(getSpeciesMainGroups());
  }, [dispatch]);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <main>{children}</main>
    </Box>
  );
};
