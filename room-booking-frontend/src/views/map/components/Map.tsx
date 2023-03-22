import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "./Map.css";
import "mapbox-gl/dist/mapbox-gl.css"

mapboxgl.accessToken =
  "pk.eyJ1IjoibWlrZTEyNTIiLCJhIjoiY2xmZzJhNXJsMTV0ZTNwbnVzYnY3eWxoaiJ9.bCXZcVk_fBTZkH87GWY71Q";

const Map = () => {
  const mapContainerRef = useRef(null);

  const [lng, setLng] = useState(5);
  const [lat, setLat] = useState(34);
  const [zoom, setZoom] = useState(1.5);

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/satellite-v9",
      center: [-122.75, 49.2],
      zoom: 10.0,
    });
    
    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), "bottom-right");
    
    map.on("move", () => {
      setLng(parseFloat(map.getCenter().lng.toFixed(4)));
      setLat(parseFloat(map.getCenter().lat.toFixed(4)));
      setZoom(parseFloat(map.getZoom().toFixed(2)));
    });

    map.on("load", function () {
      // Add an image to use as a custom marker
      map.loadImage(
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/SFU-block-logo.svg/200px-SFU-block-logo.svg.png",
        function (error, image) {
          if (error) throw error;
          map.addImage("custom-marker", image);
          // Add a GeoJSON source with multiple points
          map.addSource("points", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  properties: {
                    title: "SFU Burnaby",
                    description:
                      "Simon Fraser University's mountain campus on Burnaby Mountain.",
                  },
                  geometry: {
                    coordinates: [-122.918294, 49.278642],
                    type: "Point",
                  },
                },
                {
                  type: "Feature",
                  properties: {
                    title: "SFU Surrey",
                    description:
                      "Simon Fraser University's city campus located in Surrey Central City. The main building is located in Central City Mall.",
                  },
                  geometry: {
                    coordinates: [-122.849188, 49.188197],
                    type: "Point",
                  },
                },
              ],
            },
          });
          // Add a symbol layer
          map.addLayer({
            id: "points",
            type: "symbol",
            source: "points",
            layout: {
              "icon-image": "custom-marker",
              "icon-size": 0.25,
              // get the title name from the source's "title" property
              "text-field": ["get", "title"],
              "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
              "text-offset": [0, 1.25],
              "text-anchor": "top",
            },
          });
        }
      );
    });

    // Clean up on unmount
    return () => map.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="map-container">
      <link
        href="https://api.tiles.mapbox.com/mapbox-gl-js/v0.53.0/mapbox-gl.css"
        rel="stylesheet"
      />
      <div ref={mapContainerRef} />
    </div>
  );
};

export default Map;
