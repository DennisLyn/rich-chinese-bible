
// Import libraries for making a component
import React from 'react';
import { Text, View } from 'react-native';

// Make a component
const Header = (props) => {
    const { textStyle, viewStyle } = styles;
    return (
        <View style={viewStyle}>
            <Text style={textStyle}>{props.headerText}</Text>
        </View>
    );
};


const styles = {
    viewStyle: {
        backgroundColor: '#9cdaed',
        justifyContent: 'center',
        alignItems: 'center',
        height: 35,
        paddingTop: 1,
        shadowColor: '#000000', // For IOS
        shadowOffset: { width: 0, height: 2 }, //For IOS
        shadowOpacity: 0.9, //For IOS
        elevation: 10,
        position: 'relative'
    },
    textStyle: {
        fontSize: 20
    }
};


// Make the component available to other parts of the app
export { Header };
