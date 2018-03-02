import { StyleSheet } from "react-native";

export const config = {
    colorPrimary: '#d94d5d'
}

export default styles = StyleSheet.create({
    errorTextStyle: {
        fontSize: 20,
        alignSelf: 'center',
        color: 'red'
    },
    logo: {
        height: 150
    },
    logoSmall: {
        height: 75
    },
    sideBar: {
        paddingTop: 20,
        backgroundColor: config.colorPrimary
    },
    light: {
        color: '#fff'
    },
    paddedContainer: {
        paddingLeft: 16,
        paddingRight: 16,
        backgroundColor: 'white'
    },
    listImage: {
        height: 125,
        width: 125
    },
    column: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 32
    },
    row: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20
    },
    rowSpaceBetween: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20
    },
    rowSmall: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    desc: {
        fontStyle: 'italic',
        paddingBottom: 8
    },
    menuItem: {
        fontWeight: 'normal',
        fontStyle: 'italic'
    },
    bold: {
        fontWeight: 'bold'
    },
    header: {
        fontWeight: 'bold',
        paddingBottom: 8
    },
    cardH1: {
        fontSize: 18
    },
    cardH2: {
        fontSize: 14
    },
    h1: {
        fontSize: 24 
    },
    h2: {
        fontSize: 20
    },
    h3: {
        fontSize: 16
    },
    center: {
        textAlign: 'center'
    },
    iconWhite: {
        color: 'white'
    },
    fullWidth: {
        width: '100%'
    },
    section: {
        marginTop: 8,
        marginBottom: 8
    }
});