import React, { Component, useState } from 'react';
import MapGL, { Source, Layer } from 'react-map-gl';
import { clusterLayer, clusterCountLayer, unclusteredPointLayer } from './layer';

function Map() {
    const TOKEN = 'pk.eyJ1Ijoic3N0ZWd1IiwiYSI6ImNrODdzNjNqYjAxNHgzZ28zOXFjbThzYmUifQ.IzbYorcpup3glrse186GdA';

    const [viewport, setViewport] = useState({
        width: '100%',
        height: 500,
        latitude: 37.7577,
        longitude: -122.4376,
        zoom: 3
    });


    return (
        <MapGL
            {...viewport}
            onViewportChange={setViewport}
            mapboxApiAccessToken={TOKEN}
            mapStyle="mapbox://styles/mapbox/dark-v9"
        >
            <Source id="cData" type="geojson"
                data="http://localhost:5000/cases/mb/Canada/4-8-2020" cluster={true}
                clusterMaxZoom={14}
                clusterRadius={50}
            >
                <Layer {...clusterLayer} />
                <Layer {...clusterCountLayer} />
                <Layer {...unclusteredPointLayer} />
            </Source>
        </MapGL>
    );
}

export default Map;