import React, { useState } from 'react';
import { View, ScrollView, Modal } from 'react-native';
import { useTheme, Text, Button } from '@ui-kitten/components';
import { DataGroupAge } from './dataGroupAge.component.js';
import { DataGroupGender } from './dataGroupGender.component.js';
import { DataGroupActivity } from './dataGroupActivity.component.js';
import { DataGroupPosture } from './dataGroupPosture.component.js';

import { styles } from './dataEntryModal.styles.js';

const age = ["0 - 14", "15 - 21", "22 - 30", "30 - 50", "50 - 65", "65+"]
const gender = ["Male", "Female"]
const activity = ["Socializing", "Waiting", "Recreation", "Eating", "Solitary"]
const posture = ["Standing", "Sitting", "Laying", "Squatting"]
const delimeter = ', '

export function DataEntryModal(props) {

    const [ageIndex, setAgeIndex] = useState(-1)
    const [genderIndex, setGenderIndex] = useState(-1)
    const [activityCount, setActivityCount] = useState(-1)
    const [postureIndex, setPostureIndex] = useState(-1)

    const [ageMatrix, setAgeMatrix] = useState([])
    const [genderMatrix, setGenderMatrix] = useState([])
    const [activityMatrix, setActivityMatrix] = useState([])
    const [postureMatrix, setPostureMatrix] = useState([])

    const [activityList, setActivityList] = useState('')

    const theme = useTheme();

    const setAgeData = async(index, matrix) => {

        await setAgeIndex(index)
        await setAgeMatrix(matrix)
    }

    const setGenderData = async(index, matrix) => {

        await setGenderIndex(index)
        await setGenderMatrix(matrix)
    }

    const setActivityData = async(count, matrix) => {

        await setActivityCount(count)
        await setActivityMatrix(matrix)

        let activityArr = []

        // Get the appropriate activity values
        for (let i = 0; i < 5; i++) {
            if (matrix[i] == 1) {
                activityArr.push(activity[i])
            }
        }

        let activityStr = ''

        // Format activity string
        activityArr.forEach(element => {
            activityStr += element
            activityStr += delimeter
        });

        // Remove extra delimeter
        activityStr = activityStr.slice(0, -2)

        await setActivityList(activityStr)
    }

    const setPostureData = async(index, matrix) => {

        await setPostureIndex(index)
        await setPostureMatrix(matrix)
    }

    // Sends the data to be stored
    const sendData = async () => {

        let data = {
            ageIndex: ageIndex,
            genderIndex: genderIndex,
            activityCount: activityCount,
            postureIndex: postureIndex,
            age: age[ageIndex],
            gender: gender[genderIndex],
            activity: activityList,
            posture: posture[postureIndex],
            colorIndex: postureIndex
        }

        await props.closeData(data)
    }

    return(
        <Modal transparent={true} animationType='slide' visible={props.visible}>
          <View style={styles.modalContainer}>
            <View
              style={[ styles.scorllViewContainer, {backgroundColor:theme['background-basic-color-1']}]}
            >
                <ScrollView>
                    <Text category={'h1'} style={styles.textTitle}>Data</Text>
                    <View style={styles.dataGroupView}>

                        <DataGroupAge setAgeData={setAgeData}/>
                        <DataGroupGender setGenderData={setGenderData}/>
                        <DataGroupActivity setActivityData={setActivityData}/>
                        <DataGroupPosture setPostureData={setPostureData}/>

                    </View>

                    <Button style={styles.button} onPress={sendData}>
                        <Text>Submit</Text> 
                    </Button>

                </ScrollView>
            </View>
          </View>
        </Modal>
    )
}
