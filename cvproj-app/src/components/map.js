import React, { Component, useState } from 'react';
import MapGL, { Source, Layer, FullscreenControl } from 'react-map-gl';
import { clusterLayer, clusterCountLayer, unclusteredPointLayer } from './layer';
import axios from 'axios';
import 'mapbox-gl/dist/mapbox-gl.css';

const TOKEN = 'pk.eyJ1Ijoic3N0ZWd1IiwiYSI6ImNrODdzNjNqYjAxNHgzZ28zOXFjbThzYmUifQ.IzbYorcpup3glrse186GdA';
const dataUrl = 'http://localhost:5000/cases/mb/Canada';

export default class Map extends Component {

    constructor(props) {
        super(props);

        this.state =
        {
            viewport: {
                width: '100%',
                height: 500,
                latitude: 37.7577,
                longitude: -122.4376,
                zoom: 3
            },
            data: {}

        };


    }

    componentDidMount() {

        axios.get(dataUrl)
            .then((result) => {
                this.setState({
                    data: result.data,
                    mounted: true
                });
            })
            .catch((err) => { console.log(err); });


    }


    render() {
        const { mounted } = this.state
        return (<MapGL
            {...this.state.viewport}
            onViewportChange={(viewport) => {
                if (mounted) { this.setState({ viewport }) }
            }}
            mapboxApiAccessToken={TOKEN}
            mapStyle="mapbox://styles/mapbox/dark-v9"

        >
            <FullscreenControl position='top-right' />
            <Source id="cData" type="geojson"
                data={this.state.data} cluster={true}
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
}