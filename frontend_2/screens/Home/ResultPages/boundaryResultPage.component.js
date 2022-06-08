import React, { useState } from 'react';
import { View, ScrollView, RefreshControl, Dimensions } from 'react-native';
import { Text, Button, Icon, Divider, MenuItem } from '@ui-kitten/components';
import { HeaderBack, HeaderBackEdit } from '../../components/headers.component';
import { ViewableArea, ContentContainer, ConfirmDelete } from '../../components/content.component';
import { getDayStr, getTimeStr } from '../../components/timeStrings.component.js';
import { helperGetResult, deleteTimeSlot, getProject, getAllResults, isUserTeamOwner } from '../../components/apiCalls';
import { formatBoundaryGraphData } from '../../components/helperFunctions';
import { MyBarChart } from '../../components/charts.component';

import { styles } from './resultPage.styles';

//quantitative data screen
export function BoundaryResultPage(props) {

  const [refreshing, setRefreshing] = useState(false);
  const [editMenuVisible, setEditMenuVisible] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refreshDetails();
    setRefreshing(false);
  }, []);

  const refreshDetails = async () => {
    if (props.selectedResult !== null && props.selectedResult.sharedData !== undefined) {
      let result = await helperGetResult(
                           props.selectedResult._id,
                           "boundary_maps/",
                           "boundary",
                           props.selectedResult.sharedData,
                           props.project
                         );
      result = await formatBoundaryGraphData(result);
      await props.setSelectedResult(result);
      await refreshProjectPageDetails();
    }
  };

  // refreshes previous page
  const refreshProjectPageDetails = async () => {
    let proj = await getProject(props.project);
    if (proj !== null) {
      let results = await getAllResults(proj);
      await props.setResults(results);
    }
  };

  const deleteResult = async () => {
    let success = false;
    if (props.selectedResult !== null) {
      success = await deleteTimeSlot("boundary_maps", props.selectedResult._id);
    }
    if (success) {
      await refreshProjectPageDetails();
      await setConfirmDeleteVisible(false);
      props.navigation.goBack();
    }
  }

  if (props.selectedResult === null ||
      !props.selectedResult.success ||
      props.selectedResult.graph === undefined) {
    return (
      <ViewableArea>
        {isUserTeamOwner(props.team, props.userId)
          ?
          <HeaderBackEdit {...props} text={"No results"} editMenuVisible={editMenuVisible} setEditMenuVisible={setEditMenuVisible}>
            <MenuItem title='Delete Result' onPress={() => {setEditMenuVisible(false); setConfirmDeleteVisible(true)}}/>
          </HeaderBackEdit>
          :
          <HeaderBack {...props} text={"No results"}/>
        }
        <ConfirmDelete
          visible={confirmDeleteVisible}
          setVisible={setConfirmDeleteVisible}
          dataType={"result"}
          deleteFunction={deleteResult}
        />
        <ContentContainer>
          <ScrollView
            style={styles.margins}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
          >

            <Text category={'h5'}>No result information for this activity</Text>

          </ScrollView>
        </ContentContainer>
      </ViewableArea>
    );
  }

  let areaTitle = '';
  let viewMap = true;
  let errorMessage = 'Error: \n';

  // error checking for area
  if (props.selectedResult.sharedData.area === undefined ||
      props.selectedResult.sharedData.area === null ||
      props.selectedResult.sharedData.area.length <= 0
    ) {
      areaTitle = 'unknown';
      viewMap = false;
      errorMessage += '- Area information has been deleted\n';
  } else {
    areaTitle = (props.selectedResult.sharedData.area.title === undefined ? 'Project Perimeter' : props.selectedResult.sharedData.area.title)
  }

  // error checking for standing points
  if (props.selectedResult.standingPoints === undefined ||
      props.selectedResult.standingPoints === null ||
      props.selectedResult.standingPoints.length <= 0
    ) {
      viewMap = false;
      errorMessage += '- Standing point information has been deleted\n';
  }
  errorMessage += '\n\t Unable to Load Map View';

  let startTime = new Date(props.selectedResult.date);
  let day = new Date(props.selectedResult.sharedData.date);

  let researchers = props.selectedResult.researchers.map(user => {
    return "\n\t" + user.firstname + ' ' + user.lastname;
  });

  const chartWidth = Dimensions.get('window').width*0.95;
  const chartHeight = 210;

  const color = '#006FD6';

  const viewMapResults = () => {
    props.navigation.navigate("BoundaryMapResultsView");
  }
  
//   // used to render multiple barcharts based off the # of standing points/length of the data array
//   const MultiBarChart = () =>{
//     let component = [[]]
//     for(let i = 0; i < props.selectedResult.standingPoints.length; i++){
//       // call something here that determines the most common predominant sound
//       let predominant = mostCommon(props.selectedResult.graph[i].predominant);
//       // main component container needs this key={i.toString()}
//       component[i] = (
//         <View key={i.toString()} style={styles.spacing}>
//           <MyBarChart
//             {...props}
//             title={props.selectedResult.standingPoints[i].title}
//             rotation={'0deg'}
//             dataValues={props.selectedResult.graph[i].data}
//             dataLabels={props.selectedResult.graph[i].labels}
//             barColor={color}
//             width={chartWidth}
//             height={chartHeight}
//           />
  
//           <View style={styles.rowView}>
//             <Text>Sound Decibel: {props.selectedResult.graph[i].average.toFixed(2)} dB</Text>
//             <Text>Sound Type: {predominant}</Text>
//           </View>

//         </View>
//       )
//     }
//     return(
//       <View>
//         {component}
//       </View>
//     )
//   }
  
  return (
    <ViewableArea>
      {isUserTeamOwner(props.team, props.userId)
        ?
        <HeaderBackEdit {...props}
          text={props.project.title + ": " + props.selectedResult.sharedData.title}
          editMenuVisible={editMenuVisible}
          setEditMenuVisible={setEditMenuVisible}
        >
          <MenuItem title='Delete Result' onPress={() => {setEditMenuVisible(false); setConfirmDeleteVisible(true)}}/>
        </HeaderBackEdit>
        :
        <HeaderBack {...props} text={props.project.title + ": " + props.selectedResult.sharedData.title}/>
      }
      <ConfirmDelete
        visible={confirmDeleteVisible}
        setVisible={setConfirmDeleteVisible}
        dataType={"result"}
        deleteFunction={deleteResult}
      />
      <ContentContainer>
        <ScrollView
          style={styles.margins}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        >

          <Text category={'h5'}>Spatial Boundaries Results</Text>
          <Divider style={styles.metaDataTitleSep} />

          <Text>Team: {props.team.title}</Text>
          <Text>Admin: {props.team.users[0].firstname} {props.team.users[0].lastname}</Text>

          <Divider style={styles.metaDataSep} />

          <Text>Location: {props.project.description}</Text>
          <Text>Area: {areaTitle}</Text>

          <Divider style={styles.metaDataSep} />

          <Text>Day: {getDayStr(day)}</Text>
          <Text>Start Time: {getTimeStr(startTime)} </Text>
          <Text>Duration: {props.selectedResult.sharedData.duration} min</Text>

          <Divider style={styles.metaDataSep} />

          <Text>Researcher(s): {researchers} </Text>

          <Divider style={styles.metaDataEndSep} />

          {viewMap
            ?
              <View style={styles.mapButton}>
                <Button
                  style={styles.button}
                  status={'info'}
                  appearance={'outline'}
                  accessoryRight={MapIcon}
                  onPress={viewMapResults}
                >
                  View Map
                </Button>
              </View>
            :
              <View style={styles.errorMsgView}>
                <Text status='danger' category='s1' style={styles.errorMsgText}>
                  {errorMessage}
                </Text>
              </View>
          }
            {/* barcharts get rendered here */}
            {/* <MultiBarChart /> */}

        </ScrollView>
      </ContentContainer>
    </ViewableArea>
  );
};

// compass-outline
// pin-outline
const MapIcon = (props) => (
  <Icon {...props} name='compass-outline'/>
);

// file-text-outline
// pie-chart-outline
const ChartIcon = (props) => (
  <Icon {...props} name='file-text-outline'/>
);