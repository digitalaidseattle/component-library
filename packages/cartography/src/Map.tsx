/**
 * MapPage.tsx
 * Display information of a ticket
 */

// react
import React, { ReactNode, useEffect, useRef, useState } from 'react';

// material-ui
import {
    Box,
    Stack,
    useMediaQuery,
    useTheme
} from '@mui/material';

import {
    FullscreenControl,
    Map as MapLibre,
    Marker,
    NavigationControl,
    Popup,
    ScaleControl
} from '@vis.gl/react-maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

import { Configuration } from './Configuration';
import { Location } from './types';

const DEFAULT_VIEW = {
    longitude: -122.4,
    latitude: 47.6061,
    zoom: 7
}

const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`;

const pinStyle = {
    cursor: 'pointer',
    fill: '#0aa',
    stroke: 'none'
};

function DefaultPin({ size = 20 }) {
    return (
        <svg height={size} viewBox="0 0 24 24" style={pinStyle}>
            <path d={ICON} />
        </svg>
    );
}

type MapProps<T> = {
    items: T[],
    pins: Location[],
    selectedLocation: Location | null,
    renderCard: (item: T) => ReactNode,
    renderPopup: (loc: Location) => Promise<ReactNode>,
    renderPin?: (loc: Location) => ReactNode,
}

export function Map<T>({
    items,
    pins,
    selectedLocation,
    renderCard,
    renderPopup,
    renderPin
}: MapProps<T>) {
    const configuration = Configuration.getInstance();

    const [viewState, setViewState] = React.useState(DEFAULT_VIEW);
    const markerRef = useRef<any>();
    const theme = useTheme();
    const isMobileView = useMediaQuery(theme.breakpoints.down("md"));

    const [popupInfo, setPopupInfo] = useState<Location | null>(null);

    const [markers, setMarkers] = useState<ReactNode[]>([]);
    const [popup, setPopup] = useState<ReactNode>([]);
    const [cards, setCards] = useState<ReactNode>();

    useEffect(() => {
        setPopupInfo(selectedLocation);
    }, [selectedLocation]);

    useEffect(() => {
        setCards(
            <Box sx={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                pb: 1,
                pt: 1,
                pointerEvents: "none",
                zIndex: 100,
                height: isMobileView ? "35%" : "100%",
                width: isMobileView ? "100%" : "25%",
                overflowY: "auto",
                "&::-webkit-scrollbar": { display: "none" },
                scrollbarWidth: "none",
            }}>
                <Stack data-testid="card-list"
                    direction={isMobileView ? "row" : "column"}
                    sx={{
                        pointerEvents: "auto",
                        mx: 1.5,
                        mb: 0.5,
                        borderRadius: 3,
                        bgcolor: "transparent",
                        overflowY: "auto",
                        gap: 2,
                        px: 0.5,
                        py: 0.75,
                    }}>
                    {items.map((item, index) => (
                        <Box key={index} sx={{ cursor: "pointer" }}>
                            {renderCard(item)}
                        </Box>
                    ))}
                </Stack>
            </Box>
        );
    }, [items, isMobileView]);

    useEffect(() => {
        setMarkers(pins
            .map((pin) => (
                <Marker
                    key={pin.name}
                    longitude={pin.longitude}
                    latitude={pin.latitude}
                    anchor="bottom"
                    onClick={e => {
                        // If we let the click event propagates to the map, it will immediately close the popup
                        // with `closeOnClick: true`
                        e.originalEvent.stopPropagation();
                        handleMarkerSelection(pin);
                    }}
                >
                    <div
                        style={{
                            position: "relative",
                            transition: "transform 0.3s ease",
                            transform: isSelected(pin) ? "scale(1.5)" : "scale(1)",
                        }}
                    >
                        {renderPin ? renderPin(pin) : <DefaultPin size={20} />}
                    </div>
                </Marker >
            )))
    }, [pins]);

    useEffect(() => {
        if (popupInfo) {
            markerRef.current?.flyTo({
                center: [popupInfo.longitude, popupInfo.latitude],
                duration: 2000,
            });
            setViewState({
                longitude: popupInfo.longitude,
                latitude: popupInfo.latitude,
                zoom: viewState.zoom
            });
            renderPopup(popupInfo)
                .then((child) => {
                    setPopup(
                        <Popup
                            anchor="top"
                            longitude={Number(popupInfo.longitude)}
                            latitude={Number(popupInfo.latitude)}
                            onClose={() => setPopupInfo(null)}
                        >
                            {child}
                        </Popup>
                    )
                });
        } else {
            setPopup(null);
        }
    }, [popupInfo]);

    function isSelected(location: Location): boolean {
        if (!popupInfo) return false;
        return popupInfo.latitude === location.latitude && popupInfo.longitude === location.longitude;
    }

    const handleMarkerSelection = (location: Location) => {
        setPopupInfo(location);
    }

    return (
        <MapLibre
            {...viewState}
            ref={markerRef}
            onMove={evt => setViewState(evt.viewState)}
            mapStyle={configuration.mapStyle + '?key=' + configuration.apiKey}
        >
            {/* <GeolocateControl position="top-right" /> */}
            <FullscreenControl position="top-right" />
            <NavigationControl position="top-right" />
            <ScaleControl position={isMobileView ? "top-left" : "bottom-right"} />
            {markers}
            {popup}
            {cards}
        </MapLibre>
    );
}
