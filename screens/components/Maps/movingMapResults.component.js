import React from 'react';
import MapView, { Marker, Polygon, Polyline } from 'react-native-maps'
import { View } from 'react-native';
import { PressMapAreaWrapper } from './mapPoints.component';

export function MovingMapResults(props) {

    // Color constants for the data points
    const colors = ["blue", "red", "yellow", "green", "orange", "pink"]

    const AllLines = () => {

        if (props.viewAllLines) {

            return (props.totalPaths.map((obj, index) => (

                <Polyline
                    coordinates={obj.path}
                    strokeWidth={3}
                    strokeColor={colors[obj.colorIndex]}
                    key={index}
                />
            )))
        }
        else{
            return null
        }
    }

    return(

        <View>
            <PressMapAreaWrapper
                area={props.area}
                mapHeight={'97.2%'}
                onPress={() => null}
            >
                <Marker
                    coordinate = {props.position}
                />

                <Polygon
                    coordinates={props.area}
                    strokeWidth={3}
                    strokeColor={'rgba(255,0,0,0.5)'}
                    fillColor={'rgba(0,0,0,0.2)'}
                />

                {/* <ShowPolygon/> */}

                <AllLines/>

            </PressMapAreaWrapper>
        </View>
    )
};
