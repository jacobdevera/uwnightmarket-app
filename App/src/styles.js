import { StyleSheet } from "react-native";

export default styles = StyleSheet.create({
    logo: {
        height: 150
    },
    logoSmall: {
        height: 75
    },
    sideBar: {
        paddingTop: 20,
        backgroundColor: "#d94d5d"
    },
    light: {
        color: '#fff'
    },
    column: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 40
    },
    row: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20
    }
});