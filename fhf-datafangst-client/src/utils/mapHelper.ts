import { Map } from "ol";
import { fromLonLat, toLonLat } from "ol/proj";
import Draw, { createBox, DrawEvent } from "ol/interaction/Draw";
import { Circle, Fill, Icon, Stroke, Style, Text } from "ol/style";
import Feature from "ol/Feature";
import VectorSource from "ol/source/Vector";
import WMTSCapabilities from "ol/format/WMTSCapabilities";
import GeoJSON from "ol/format/GeoJSON";
import Geometry from "ol/geom/Geometry";
import blueVessel from "assets/icons/vessel-map.svg";
import greyVessel from "assets/icons/vessel-map-grey.svg";
import { Haul, Vessel } from "models";
import { differenceInHours } from "date-fns";
import { Point } from "ol/geom";
import ColorScale from "color-scales";
import { findHighestHaulCatchWeight, sumHaulCatches } from "utils";

export const getColorGrade = (colorGrade: number, maxGrade: number) => {
  const colorScale = new ColorScale(
    0,
    maxGrade,
    ["#66b2ab", "#1b8a5a", "#fbb021", "#f68838", "#ee3e32"],
    0.7,
  );

  return colorScale.getColor(colorGrade).toRGBAString();
};

export const generateGridBoxStyle = (
  areaCode: string,
  colorGrade: number,
  maxGrade: number,
): Style => {
  return new Style({
    fill: new Fill({ color: getColorGrade(colorGrade, maxGrade) }),
    // stroke: new Stroke({ color: "#387D90", width: 1 }),
    text: new Text({
      fill: new Fill({ color: "#387D90" }),
      text: areaCode,
    }),
  });
};

export const defaultGridBoxStyle = (areaCode: string): Style => {
  return new Style({
    fill: new Fill({
      color: [255, 255, 255, 0],
    }),
    // stroke: new Stroke({ color: "#387D90", width: 1 }),
    text: new Text({ fill: new Fill({ color: "#387D90" }), text: areaCode }),
  });
};

export const selectedGridBoxStyle = (areaCode: string): Style => {
  return new Style({
    fill: new Fill({
      color: [255, 255, 255, 0.3],
    }),
    stroke: new Stroke({ color: "#387D90", width: 1 }),
    text: new Text({ fill: new Fill({ color: "#387D90" }), text: areaCode }),
  });
};

export const generateVesselsVector = (vessels: Record<string, Vessel>) => {
  const vesselsVector = new VectorSource();

  for (const vesselId in vessels) {
    const vessel = vessels[vesselId];
    if (!vessel.currentPosition) {
      continue;
    }

    const style = vessel.mapPlot.getStyle() as Style;

    // Set grey icon on boats with stale position data
    if (
      differenceInHours(
        new Date(),
        new Date(vessel.currentPosition.timestamp),
      ) > Number(process.env.REACT_APP_VESSEL_MAP_THRESHOLD_HOURS as string)
    ) {
      style.setImage(
        new Icon({
          rotation: ((vessel.currentPosition.cog ?? 0) * Math.PI) / 180,
          opacity: 1,
          anchor: [0.5, 0.5],
          scale: 0.05,
          src: greyVessel,
        }),
      );
    }

    vessel.mapPlot.setStyle(style);

    const geometry = vessel.mapPlot.getGeometry();
    if (!geometry) {
      vessel.mapPlot.setGeometry(
        new Point(
          fromLonLat([vessel.currentPosition.lon, vessel.currentPosition.lat]),
        ),
      );
    }
    vesselsVector.addFeature(vessel.mapPlot);
  }

  return vesselsVector;
};

export const updateVesselsVector = (
  vector: VectorSource<Geometry>,
  vessels: Record<string, Vessel>,
) => {
  if (!vessels || !vector) {
    return;
  }

  for (const vesselId in vessels) {
    const vessel = vessels[vesselId];
    if (!vessel.currentPosition) {
      continue;
    }

    const geometry = vessel.mapPlot.getGeometry() as Point;

    // If there is no geometry object, add new geometry to vessel Feature.
    if (!geometry) {
      vessel.mapPlot.setGeometry(
        new Point(
          fromLonLat([vessel.currentPosition.lon, vessel.currentPosition.lat]),
        ),
      );
      vector.addFeature(vessel.mapPlot);
    } else {
      geometry.setCoordinates(
        fromLonLat([vessel.currentPosition.lon, vessel.currentPosition.lat]),
      );
    }

    const rotation = ((vessel.currentPosition.cog ?? 0) * Math.PI) / 180;
    const style = vessel.mapPlot.getStyle() as Style;

    // Set grey icon on boats with stale position data
    style.setImage(
      new Icon({
        rotation,
        opacity: 1,
        anchor: [0.5, 0.5],
        scale: style.getImage().getScale(),
        src:
          differenceInHours(
            new Date(),
            new Date(vessel.currentPosition.timestamp),
          ) > Number(process.env.REACT_APP_VESSEL_MAP_THRESHOLD_HOURS)
            ? greyVessel
            : blueVessel,
      }),
    );

    vessel.mapPlot.changed();
  }
};

export const generateHaulsVector = (hauls: Haul[] | undefined) => {
  if (!hauls) {
    return;
  }

  const haulsVector = new VectorSource();
  const highestCatchSum = findHighestHaulCatchWeight(hauls);

  for (let i = 0; i < hauls.length; i++) {
    const haul = hauls[i];
    const sum = sumHaulCatches(haul.catches);
    const haulFeature = new Feature({
      geometry: new Point(
        fromLonLat([haul.startLongitude, haul.startLatitude]),
      ),
      haul,
    });
    haulFeature.setStyle(
      new Style({
        image: new Circle({
          radius: 2,
          fill: new Fill({
            color: getColorGrade(sum, highestCatchSum),
          }),
        }),
      }),
    );

    haulsVector.addFeature(haulFeature);
  }

  return haulsVector;
};

export const generateHaulsHeatmap = (hauls: Haul[] | undefined) => {
  if (!hauls) {
    return;
  }

  const heatmapVector = new VectorSource();

  for (let i = 0; i < hauls.length; i++) {
    const haul = hauls[i];

    const haulFeature = new Feature({
      geometry: new Point(
        fromLonLat([haul.startLongitude, haul.startLatitude]),
      ),
      weight: sumHaulCatches(haul.catches),
    });

    heatmapVector.addFeature(haulFeature);
  }

  return heatmapVector;
};

export const generateShorelineVector = (geoJsonObject: any) =>
  new VectorSource({
    features: new GeoJSON({
      featureProjection: process.env.REACT_APP_EPSG as string,
      geometryName: "shoreline",
    }).readFeatures(geoJsonObject),
  });

export const generateLocationsGrid = (
  geoJsonObject: any,
  colorMap: Record<string, number>,
) => {
  const features = new GeoJSON({
    featureProjection: process.env.REACT_APP_EPSG as string,
    geometryName: "fishingLocations",
  }).readFeatures(geoJsonObject);

  const highestValueIdx = Object.keys(colorMap).reduce(
    (a, b) => (colorMap[a] > colorMap[b] ? a : b),
    "0",
  );
  for (let i = 0; i < features.length; i++) {
    const feature = features[i];
    const area = feature.get("lokref");

    if (colorMap[area]) {
      const style = generateGridBoxStyle(
        area,
        colorMap[area],
        colorMap[highestValueIdx],
      );
      feature.setStyle(style);
    } else {
      const style = defaultGridBoxStyle(area.toString());
      feature.setStyle(style);
    }
  }

  return new VectorSource({ features });
};

export const parseCapabilites = (capabilitesText: string) =>
  new WMTSCapabilities().read(capabilitesText);

export const changeIconSizes = (
  vector: VectorSource<Geometry> | undefined,
  size: number,
) => vector?.forEachFeature((f) => changeIconSizeFromFeature(f, size));

export const changeIconSizeFromFeature = (
  feature: Feature<Geometry>,
  size: number,
) => {
  const style = feature.getStyle() as Style;
  if (!style) return;

  const image = style.getImage();
  image.setScale(size);

  // Re-draw change on map
  feature.changed();
};

export interface Box {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export const boxSelect = (map: Map, callback: (box: Box) => void) => {
  const source = new VectorSource({ wrapX: false });
  const geometryFunction = createBox();
  const draw = new Draw({
    source,
    geometryFunction,
    type: "Circle",
    freehand: true,
  });
  draw.on("drawend", (e: DrawEvent) => {
    e.stopPropagation();
    // `getCoordinates` exists on `Geometry`, trust me :)
    const coords = (e.feature.getGeometry() as any).getCoordinates()[0];
    if (coords?.length === 5) {
      const a = toLonLat(coords[1]);
      const b = toLonLat(coords[3]);
      const res = {
        x1: b[0],
        y1: b[1],
        x2: a[0],
        y2: a[1],
      };
      callback(res);
    }

    map.removeInteraction(draw);
  });
  map.addInteraction(draw);
};
