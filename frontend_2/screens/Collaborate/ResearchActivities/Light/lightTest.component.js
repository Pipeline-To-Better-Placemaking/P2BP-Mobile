import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { ViewableArea, ContentContainer } from '../../../components/content.component';
import { Header } from '../../../components/headers.component';
import { useTheme, Button, Text } from '@ui-kitten/components';
import { LightMap } from '../../../components/Maps/lightMap.component.js';
import { DataModal } from '../../../components/Activities/Light/dataModal.component';
import { DeleteModal } from '../../../components/Activities/deleteModal.component';
import { PopupMessage } from '../../../components/Activities/popupMessage.component';
import CountDown from 'react-native-countdown-component';

import { styles } from './lightTest.styles';

export function LightTest(props) {

    const theme = useTheme();

    const [area] = useState(props.timeSlot.area);

    // Begins the test
    const [start, setStart] = useState(false);
    const [initalStart, setInitalStart] = useState(true);

    // timer stuff
    const initalTime = props.timeSlot.timeLeft;
    // controls the rendered countdown timer
    const [timer, setTimer] = useState(initalTime);
    // controls timer interval instance
    const [id, setId] = useState();

    // Modal controls
    const [dataModal, setDataModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState(-1);
    const [deleteDesc, setDeleteDesc] = useState('');
    const [popupMsg, setPopupMsg] = useState(true);
    const [tempMarker, setTempMarker] = useState();

    // Used to store all the data info
    const [dataPoints] = useState([]);

    // End Button press or whenever the timer hits 0
    const endActivity = async () => {
        setStart(false)
        clearInterval(id);

        // close any of the modals that may be open when the test ends (timer hits 0 while in a modal)
        if(dataModal) setDataModal(false);
        
        // console.log(dataPoints)
        
        // package the data; needs to be an array for multiple entries for a test
        let data =[{
            points: dataPoints,
            time: new Date()
        }]

        // Sends the collected data to DB
        try {
            const response = await fetch('https://p2bp.herokuapp.com/api/light_maps/' + props.timeSlot._id + '/data', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + props.token
                },
                body: JSON.stringify({
                    entries: data
                })
            })

            let info = await response.json()
        
            console.log(info)
        
        } catch (error) {
            console.log("ERROR: ", error)
        }

        props.navigation.navigate("ActivitySignUpPage");
    }
    
    // Opens the data model and stores a temporary points
    const onPointCreate = async (marker) => {
        if (start) {
            setDataModal(true)
            setTempMarker(marker)
        }
    }

    // Closes the modal and saves the data point
    const closeData = async (inf) => {
        // console.log(inf)
        // save the data point to be rendered
        dataPoints.push(inf);
        setDataModal(false);
        setTempMarker();
    }
    
    // pulls up the delete modal
    const handleDelete = (index) =>{
        // sets the description and index, then pulls up the modal
        setDeleteDesc(dataPoints[index].light_description.toLowerCase() + " data point")
        setDeleteIndex(index)
        setDeleteModal(true);
    }
    
    // deletes the point from the data array
    const deletePoint = async () =>{
        // removes the data point from the array
        dataPoints.splice(deleteIndex, 1)
        
        //reset delete controls
        setDeleteIndex(-1);
        setDeleteDesc('');
        setDeleteModal(false);
    }
    
    // Start and Exit button
    const StartStopButton = () => {

        if (initalStart) {
            return(
                <Button style={styles.startButton} onPress={() => setStart(true)} >
                    <View>
                        <Text style={styles.startStopText}>Start</Text>
                    </View>
                </Button>
            )
        }
        else{
            return(
                <Button
                    status={'danger'}
                    style={styles.stopButton}
                    onPress={() => endActivity()}
                    >
                        <View>
                            <Text style={styles.startStopText}>End</Text>
                        </View>
                    </Button>
            )
        }
    }

    // helps control the countdown timer
    useEffect(() =>{
        // only start the timer when we start the test
        if(start){
            setPopupMsg(false);
            startTime(timer);
            setInitalStart(false);
        }
    }, [start]);

    // begins/updates the timer
    function startTime(current){
        let count = current;
        setId(setInterval(() =>{            
            count--;
            // timer is what actually gets rendered so update every second
            setTimer(count);
            //console.log(count);
            // when the timer reaches 0, call restart
            if(count === 0){
                // clear the interval to avoid resuming timer issues
                clearInterval(id);
                endActivity();
            }
        // 1000 ms == 1 s
        }, 1000));
    }

    // Count Down Timer and the Start/Exit button
    const TimeBar = () => {

        return(
            <View>
                <View style={styles.container}>

                    <StartStopButton/>

                    <View>
                        <CountDown
                            running={start}
                            until={timer}
                            size={20}
                            digitStyle={{backgroundColor:theme['background-basic-color-1']}}
                            digitTxtStyle={{color:theme['text-basic-color']}}
                            separatorStyle={{color:theme['text-basic-color']}}
                            timeToShow={['M', 'S']}
                            timeLabels={{m: '', s: ''}}
                            showSeparator
                        />
                    </View>
                </View>
            </View>
        )
    }

    // closes the modals without submitting anything
    const goBack = () =>{
        // reset the tempMarker and close the modal
        setTempMarker();
        setDataModal(false);
    }

    // Main render
    return(
        <ViewableArea>
            <Header text={'Lighting Profile'}/>
            <ContentContainer>

                <TimeBar/>

                <PopupMessage
                    visible={popupMsg}
                />

                <DataModal
                    visible={dataModal}
                    closeData={closeData}
                    point={tempMarker}
                    back={goBack}
                />

                <DeleteModal
                    visible={deleteModal}
                    setVisible={setDeleteModal}
                    dataType={deleteDesc}
                    deleteFunction={deletePoint}
                />

                <LightMap
                    area={area}
                    marker={tempMarker}
                    dataPoints={dataPoints}
                    addMarker={onPointCreate}
                    deleteMarker={handleDelete}
                />
                
            </ContentContainer>
            {start ?
                <View style={styles.descriptionView}>
                    <Text category={'s1'}>Tap on the map to plot light data points</Text>
                </View>
            :
                null
            }
        </ViewableArea>
    )
}