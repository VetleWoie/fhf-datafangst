import { FC, useCallback, useEffect } from "react";
import { generateHaulsVector } from "utils";
import {
  selectFishmap,
  selectHauls,
  selectSelectedGridsString,
  selectSelectedOrCurrentTrip,
  useAppSelector,
} from "store";
import WebGLPointsLayer from "ol/layer/WebGLPoints";

export const HaulsLayer: FC = () => {
  const haulsMap = useAppSelector(selectHauls);
  const hauls = Object.values(haulsMap);
  const fishmap = useAppSelector(selectFishmap);
  const selectedGrids = useAppSelector(selectSelectedGridsString);
  const selectedTrip = useAppSelector(selectSelectedOrCurrentTrip);
  const removeLayer = useCallback(() => {
    for (const layer of fishmap.getLayers().getArray()) {
      if (layer.get("name") === "HaulsLayer") {
        fishmap.removeLayer(layer);
        layer.dispose();
        return;
      }
    }
  }, [fishmap]);

  useEffect(() => {
    if (!selectedGrids.length || selectedTrip) {
      removeLayer();
      return;
    }

    if (!hauls.length) return;

    const source = generateHaulsVector(hauls);
    if (source) {
      const layer = new WebGLPointsLayer({
        source,
        zIndex: 5,
        properties: { name: "HaulsLayer" },
        style: {
          "circle-radius": 3,
          "circle-fill-color": [
            "color",
            ["get", "red"],
            ["get", "green"],
            ["get", "blue"],
          ],
        },
      });
      removeLayer();
      fishmap.addLayer(layer);
      return () => {
        removeLayer();
      };
    }
  }, [fishmap, removeLayer, haulsMap, selectedTrip]);

  return null;
};
