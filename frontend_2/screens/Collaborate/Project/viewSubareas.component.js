import React, { useState } from 'react';
import { View } from 'react-native';
import { Text, Button, Icon, Divider, List, ListItem } from '@ui-kitten/components';
import { MapAreaWrapper, ShowAreas, getRegionForCoordinates } from '../../components/Maps/mapPoints.component';
import { ModalContainer } from '../../components/content.component';
import { EditPoints } from './editArea.component';

import { styles } from './sharedView.style';

export function EditSubAreas(props) {

  const location = getRegionForCoordinates(props.project.subareas[0].points);
  const [editAreaVisible, setEditAreaVisible] = useState(false);
  const nullableEntry = {
    points: props.project.subareas[0].points[0],
    newArea: true,
    index: 1,
    _id: '',
    location: location,
    title:'Area ',
};
  const [areaInfo, setAreaInfo] = useState({...nullableEntry});
  const [tempArea, setTempArea] = useState([]);

  const close = () => {
    props.setVisible(false);
  }

  const editArea = async (newArea, area, index) => {
    let temp = {...areaInfo};
    temp.points = area;
    temp.newArea = newArea;
    temp.index = index;
    temp._id = '';
    temp.location = getRegionForCoordinates(props.project.subareas[0].points);
    temp.title = 'Area ';

    if(!newArea) {
      temp.location = getRegionForCoordinates(area.points);
      temp._id = area._id;
      temp.points = area.points;
      if (props.project.subareas[0]._id === area._id && area.title === undefined) {
        temp.title = "Project Perimeter";
      } else {
        temp.title = area.title;
      }
    }

    await setAreaInfo(temp);
    await setTempArea([...temp.points]);
    await setEditAreaVisible(true);
  }

  const renderAreaItem = ({ item, index }) => (
    <ListItem
      title={((index === 0 && item.title === undefined) ? 'Project Perimeter' : item.title)}
      accessoryRight={EditIcon}
      onPress={() => editArea(false, item, index)}
    />
  )

  return (
    <ModalContainer {...props} visible={props.visible}>
      <EditPoints
        {...props}
        areaInfo={areaInfo}
        tempArea={tempArea}
        setTempArea={setTempArea}
        visible={editAreaVisible}
        setVisible={setEditAreaVisible}
      />
      <View style={styles.titleView}>
        <Text style={styles.titleText}>Edit Area(s)</Text>
        <Button
          style={styles.button}
          onPress={close}
          status='info'
          appearance={'outline'}
        >
          Done
        </Button>
      </View>

      <View style={styles.mapWrapper}>
        <MapAreaWrapper
          area={props.project.subareas[0].points}
          mapHeight={'100%'}
        >
          <ShowAreas areas={props.project.subareas}/>
        </MapAreaWrapper>
      </View>

      <View style={styles.container}>
        <View style={styles.subTitleView}>
          <Text style={styles.titleText} >Areas </Text>
        </View>
        <Button
          status='info'
          onPress={() => editArea(true, [], props.project.subareas.length)}
          accessoryLeft={PlusIcon}
        >
          Create New Subarea
        </Button>
      </View>

      <List
        data={props.project.subareas}
        ItemSeparatorComponent={Divider}
        renderItem={renderAreaItem}
      />
    </ModalContainer>
  );
}

const ForwardIcon = (props) => (
  <Icon {...props} name='arrow-ios-forward'/>
);

const CancelIcon = (props) => (
  <Icon {...props} name='close-outline'/>
);

const CreateIcon = (props) => (
  <Icon {...props} name='checkmark-outline'/>
);

const EditIcon = (props) => (
  <Icon {...props} name='edit-outline'/>
);

const PlusIcon = (props) => (
  <Icon {...props} name='plus-outline'/>
);

const DeleteIcon = (props) => (
  <Icon {...props} name='trash-2-outline'/>
);