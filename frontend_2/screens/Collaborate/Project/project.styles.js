import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({

    teamView: {
        marginTop: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 20
    },

    teamTextView:{
        flexDirection:'column', 
        justifyContent:'flex-end'
    },

    teamText: {
        fontSize: 25,
    },

    createTeamButtonView: {
        marginRight: 20,
    },

    textTitle:{
        fontSize:20
    },

    mapWrapper:{
        height:'45%'
    },

    divider:{
        marginTop: 5
    },

    listView:{
        flexDirection:'row', 
        justifyContent:'center', 
        maxHeight:'40%'
    },

    list:{
        maxHeight:'100%', 
        maxWidth:'90%', 
        minHeight:150, 
        backgroundColor: 'rgba(0, 0, 0, 0)'
    }

});

export default styles;