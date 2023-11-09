import { Box, Button, Drawer, Typography } from "@mui/material";
import {
  BenchmarkCards,
  Header,
  SpeciesHistogram,
  LocalLoadingProgress,
  FollowList,
  HistoricalCatches,
  DatePeriodPicker,
} from "components";
import { FC, useEffect, useState } from "react";
import { useAuth } from "oidc-react";
import {
  MenuViewState,
  getBenchmarkData,
  getBenchmarkOwnTrips,
  getTrips,
  selectBenchmarkNumHistoric,
  selectBenchmarkTimeSpan,
  selectBwUserProfile,
  selectIsLoggedIn,
  selectTrips,
  selectUser,
  selectVesselsByCallsign,
  selectVesselsByFiskeridirId,
  setViewState,
  useAppDispatch,
  useAppSelector,
  selectBenchmarkPeriod,
  selectTripsLoading,
  getLandings,
} from "store";
import { Ordering, TripSorting } from "generated/openapi";
import { GridContainer, HeaderButtonCell, HeaderTrack } from "containers";
import { ArrowBackIos } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import theme from "app/theme";
import { connect } from "http2";
import { DateRange } from "components/MainMenu/SearchFilters/DateFilter";
import { DateFilter } from "components/MainMenu/SearchFilters/DateFilter";


const DataPickerFunc = (props: any) => {
  // Define your value and onChange functions here
  const [value, setValue] = useState<DateRange>(/* initial value here */);

  const onChange = (newDateRange: DateRange | undefined) => {
    // Handle the new date range here
    setValue(newDateRange);
  };

  return <DateFilter value={value} onChange={onChange} />;
};


const GridMainArea = (props: any) => (
  <Box
    sx={{
      display: "grid",
      bgcolor: "primary.main",
      gridColumnStart: 2,
      gridColumnEnd: 4,
      gridRowStart: 2,
      gridRowEnd: 5,
    }}
  >
    {props.children}
  </Box>
);

const FollowerArea = (props: any) => (
  <Box
    sx={{
      gridColumnStart: 1,
      gridColumnEnd: 1,
      gridRowStart: 2,
      gridRowEnd: 5,
      display: "flex",
      flexDirection: "column",
      overflowY: "hidden",
    }}
  >
    {props.children}
  </Box>
);


export const BenchmarkView: FC = () => {
  const { signIn, isLoading, userData } = useAuth();
  const loggedIn = useAppSelector(selectIsLoggedIn);
  const profile = useAppSelector(selectBwUserProfile);
  const vesselInfo = profile?.vesselInfo;
  const vessels = useAppSelector(selectVesselsByCallsign);
  const fiskeridirVessels = useAppSelector(selectVesselsByFiskeridirId);
  const vessel = vesselInfo?.ircs ? vessels[vesselInfo.ircs] : undefined;
  const trips = useAppSelector(selectTrips);
  const tripsLoading = useAppSelector(selectTripsLoading);
  const user = useAppSelector(selectUser);
  const benchmarkHistoric = useAppSelector(selectBenchmarkNumHistoric);
  const benchmarkTimespan = useAppSelector(selectBenchmarkTimeSpan);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const followVessels = user?.following.map((id) => fiskeridirVessels[id]);

  let BenchmarkPeriod = useAppSelector(selectBenchmarkPeriod);

  useEffect(() => {
    dispatch(setViewState(MenuViewState.Benchmark));
    if (vessel) {
      dispatch(
        getTrips({
          vessels: [vessel],
          sorting: [TripSorting.StopDate, Ordering.Desc],
          limit: benchmarkHistoric,
          offset: 0,
        }),
      );
      dispatch(
        getLandings({
          vessels: [vessel],
          years: [benchmarkTimespan.startYear, benchmarkTimespan.endYear],
        }),
      );
    }
    if (followVessels) {
      followVessels.forEach((vessel) => {
        dispatch(
          getBenchmarkData({
            vessels: [vessel],
            sorting: [TripSorting.StopDate, Ordering.Desc],
            limit: benchmarkHistoric,
            offset: 0,
          }),
        );
      });
    }
  }, [vessel]);

  if (!vessel) {
    return <></>;
  }

  if (!loggedIn && !isLoading && !userData) {
    signIn();
  }
  if (!vessel) {
    navigate("/");
    return <p>No vessel associated with this user</p>;
  }

  if (BenchmarkPeriod === undefined) {
    BenchmarkPeriod = trips
      ? new DateRange(new Date(trips[trips.length - 1].start), new Date(trips[0].end))
      : new DateRange(new Date(), new Date());
  }

  return (
    <>
      <GridContainer>
        <HeaderTrack>
          <Header />
        </HeaderTrack>
        <HeaderButtonCell>
          <Button
            sx={{
              borderRadius: 0,
              borderBottom: `1px solid ${theme.palette.primary.dark}`,
              p: 3,
              height: "100%",
              color: "white",
              ":hover": {
                bgcolor: "secondary.dark",
                borderColor: "secondary.dark",
              },
              zIndex: 10000,
            }}
            onClick={() => {
              dispatch(setViewState(MenuViewState.Overview));
              navigate("/");
            }}
            startIcon={<ArrowBackIos />}
          >
            <Typography variant="h6">Tilbake til kart</Typography>
          </Button>
        </HeaderButtonCell>
        <FollowerArea>
          <Drawer
            variant="permanent"
            sx={{
              height: "100%",
              "& .MuiDrawer-paper": {
                width: 500,
                position: "relative",
                boxSizing: "border-box",
                bgcolor: "primary.main",
                color: "white",
                flexShrink: 0,
                height: "100vh",
              },
              "& .MuiOutlinedInput-root": { borderRadius: 0 },
            }}
          >
            <Typography color={"white"} variant="h5" sx={{ padding: "10px" }}>
              FØLGELISTE
            </Typography>
            <FollowList />
          </Drawer>
        </FollowerArea>
        <GridMainArea>
          {tripsLoading && <LocalLoadingProgress />}
          {trips?.length && (
            <Box>
              <Box sx={{display: "grid", placeItems: "center" }}>
                  <DatePeriodPicker existingTrips={false}/>
              </Box>
              <BenchmarkCards />
              <SpeciesHistogram />
              <HistoricalCatches />
            </Box>
          )}
          <DatePeriodPicker period={BenchmarkPeriod} existingTrips={false}/>
          {!tripsLoading && !trips?.length && (
            <Box sx={{ display: "grid", placeItems: "center" }}>
              <Typography color="text.secondary" variant="h2">
                Fant ingen turer for ditt fartøy.
              </Typography>
              <Typography sx={{ pt: 3 }} color="text.secondary" variant="h5">
                For å kunne gi deg statistikk for dine turer må du ha levert
                landingssedler eller ERS-meldinger.
              </Typography>
            </Box>
          )}
        </GridMainArea>
      </GridContainer>
    </>
  );
};