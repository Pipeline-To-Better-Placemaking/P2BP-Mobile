import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Collaborate } from '../screens/Collaborate/collaborate.component';
import { TeamPage } from '../screens/Collaborate/Team/team.component';

const { Navigator, Screen } = createStackNavigator();

export function CollaborateStack(props) {

  return (
    <Navigator headerMode='none'>
      <Screen
        name='Collaborate'
      >
      {props => <Collaborate {...props} />}
      </Screen>
      <Screen
        name='TeamPage'
        component={TeamPage}
      >
      </Screen>
    </Navigator>
  );
};
