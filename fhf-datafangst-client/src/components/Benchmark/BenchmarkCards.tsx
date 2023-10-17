import { FC } from "react";
import Box from "@mui/material/Box";
import { BenchmarkCard } from "./BenchmarkCard";
import { selectTrips, useAppDispatch, useAppSelector } from "store";
import { Grid } from "@mui/material";
import { BenchmarkModalParams, setBenchmarkModal } from "store/benchmark";
import { Trip } from "generated/openapi";
import { BenchmarkModal } from "./BenchmarkModal";
import ScaleRoundedIcon from "@mui/icons-material/ScaleRounded";
import StraightenRoundedIcon from "@mui/icons-material/StraightenRounded";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PhishingRoundedIcon from "@mui/icons-material/PhishingRounded";
import { createDurationFromHours } from "utils";

const getTotalTimes = (trips: Trip[]) =>
  trips.map(
    (t) =>
      (new Date(t.end).getTime() - new Date(t.start).getTime()) / 3_600_000,
  );

const getFishingHours = (trips: Trip[]) =>
  trips.map((t) =>
    t.hauls.reduce(
      (tot, h) =>
        tot +
        (new Date(h.stopTimestamp).getTime() -
          new Date(h.startTimestamp).getTime()) /
          3_600_000,
      0,
    ),
  );

const getFishingDistance = (trips: Trip[]) =>
  trips.map((t) => t.hauls.reduce((tot, h) => tot + (h.haulDistance ?? 0), 0));

const getFishingWeight = (trips: Trip[]) =>
  trips.map((t) => t.delivery.totalLivingWeight);

const getTripDates = (trips: Trip[]) => trips.map((t) => t.start);

enum BenchmarkType {
  TotalTime,
  FishingHours,
  FishingDistance,
  FishingWeight,
}

export const BenchmarkCards: FC = () => {
  const dispatch = useAppDispatch();
  const trips = useAppSelector(selectTrips);
  if (!trips) {
    return <></>;
  }

  const totalTimes = getTotalTimes(trips);
  const fishingHours = getFishingHours(trips);
  const fishingDistance = getFishingDistance(trips);
  const fishingWeight = getFishingWeight(trips);
  const totalTimeMean =
    totalTimes.reduce((a, b) => a + b, 0) / totalTimes.length;
  const fishingHoursMean =
    fishingHours.reduce((a, b) => a + b, 0) / fishingHours.length;
  const fishingDistanceMean =
    fishingDistance.reduce((a, b) => a + b, 0) / fishingDistance.length;
  const fishingWeightMean =
    fishingWeight.reduce((a, b) => a + b, 0) / fishingWeight.length;

  const xAxis = getTripDates(trips);
  const modalParams: Record<BenchmarkType, BenchmarkModalParams> = {
    [BenchmarkType.TotalTime]: {
      title: "Total tid",
      description:
        "Total tid er regnet som tiden mellom havneavgang og havneanløp.",
      yAxis:
        totalTimeMean > 24
          ? totalTimes.map((t) => Number((t / 24).toFixed(2)))
          : totalTimes.map((t) => Number(t.toFixed(2))),
      metric: totalTimeMean > 24 ? "Dager" : "Timer",
      xAxis,
    },
    [BenchmarkType.FishingHours]: {
      title: "Fisketid",
      description:
        "Fisketid er regnet som summen av tiden brukt under hver fangstmelding.",
      metric: fishingHoursMean > 24 ? "Dager" : "Timer",
      yAxis:
        fishingHoursMean > 24
          ? fishingHours.map((t) => Number((t / 24).toFixed(2)))
          : fishingHours.map((t) => Number(t.toFixed(2))),
      xAxis,
    },

    [BenchmarkType.FishingDistance]: {
      title: "Fiskedistanse",
      description:
        "Fiskedistanse er regnet ut basert på VMS og AIS-meldingene som ble sendt under hver fangstmelding.",
      metric: fishingDistanceMean > 1852 ? "Nautiske mil" : "Meter",
      yAxis:
        fishingDistanceMean > 1852
          ? fishingDistance.map((d) => Number((d / 1852).toFixed(2)))
          : fishingDistance.map((d) => Number(d.toFixed(2))),
      xAxis,
    },
    [BenchmarkType.FishingWeight]: {
      title: "Total vekt",
      description: "Total vekt er basert på total landet vekt",
      metric: fishingWeightMean > 1000 ? "Tonn" : "Kilo",
      yAxis:
        fishingWeightMean > 1000
          ? fishingWeight.map((w) => Number((w / 1000).toFixed(2)))
          : fishingWeight.map((w) => Number(w.toFixed(2))),
      xAxis,
    },
  };

  const handleClick = (type: BenchmarkType) => {
    const modal = {
      ...modalParams[type],
    };

    dispatch(setBenchmarkModal(modal));
  };

  return (
    <Grid
      container
      spacing={3}
      sx={{ padding: 3, backgroundColor: "primary.main" }}
    >
      <Grid item xs={6}>
        <Box>
          <BenchmarkCard
            title="Total tid"
            avatar={<AccessTimeIcon sx={{ color: "text.secondary" }} />}
            value={createDurationFromHours(totalTimes[0])}
            description="Siste tur"
            primary_color={
              totalTimes[0] > totalTimeMean ? "#6CE16A" : "#93032E"
            }
            secondary_value={createDurationFromHours(totalTimeMean)}
            secondary_description={
              "Gjennomsnitt siste " + totalTimes.length.toString() + " turer"
            }
            tooltip="Regnet ut basert på dine DEP og POR meldinger"
            onClick={() => handleClick(BenchmarkType.TotalTime)}
          />
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box>
          <BenchmarkCard
            title="Fisketid"
            avatar={<PhishingRoundedIcon sx={{ color: "text.secondary" }} />}
            value={createDurationFromHours(fishingHours[0])}
            description="Siste tur"
            primary_color={
              fishingHours[0] > fishingHoursMean ? "#6CE16A" : "#93032E"
            }
            secondary_value={createDurationFromHours(fishingHoursMean)}
            secondary_description={
              "Gjennomsnitt siste " + fishingHours.length.toString() + " turer"
            }
            tooltip="Regnet ut basert på dine fangstmeldinger"
            onClick={() => handleClick(BenchmarkType.FishingHours)}
          />
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box>
          <BenchmarkCard
            title="Fiskedistanse"
            avatar={<StraightenRoundedIcon sx={{ color: "text.secondary" }} />}
            value={(fishingDistanceMean > 1852
              ? fishingDistance[0] / 1852
              : fishingDistance[0]
            ).toFixed(1)}
            description="Siste tur"
            primary_color={
              fishingDistance[0] > fishingDistanceMean ? "#6CE16A" : "#93032E"
            }
            secondary_value={(fishingDistanceMean > 1852
              ? fishingDistanceMean / 1852
              : fishingDistanceMean
            ).toFixed(1)}
            secondary_description={
              "Gjennomsnitt siste " +
              fishingDistance.length.toString() +
              " turer"
            }
            metric={fishingDistanceMean > 1852 ? "nautiske mil" : "meter"}
            tooltip="Regnet ut basert på dine fangstmeldinger"
            onClick={() => handleClick(BenchmarkType.FishingDistance)}
          />
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box>
          <BenchmarkCard
            title="Total vekt"
            avatar={<ScaleRoundedIcon sx={{ color: "text.secondary" }} />}
            value={(fishingWeightMean > 1000
              ? fishingWeight[0] / 1000
              : fishingWeight[0]
            ).toFixed(1)}
            description="Siste tur"
            primary_color={
              fishingWeight[0] > fishingWeightMean ? "#6CE16A" : "#93032E"
            }
            secondary_value={(fishingWeightMean > 1000
              ? fishingWeightMean / 1000
              : fishingWeightMean
            ).toFixed(1)}
            secondary_description={
              "Gjennomsnitt siste " + fishingWeight.length.toString() + " turer"
            }
            metric={fishingWeightMean > 1000 ? "tonn" : "kilo"}
            tooltip="Data basert på levert vekt"
            onClick={() => handleClick(BenchmarkType.FishingWeight)}
          />
        </Box>
      </Grid>
      <BenchmarkModal />
    </Grid>
  );
};