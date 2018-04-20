import { StyleSheet, Dimensions } from "react-native";
const { height, width } = Dimensions.get('window');
export const scale = parseInt(width) / 414; // 414: iPhone 6 Plus width
export const config = {
    colorPrimary: '#d94d5d',
    colorDark: '#a21334'
}

export default styles = StyleSheet.create({
    errorTextStyle: {
        marginTop: 8,
        fontSize: 20,
        alignSelf: 'center',
        color: 'red'
    },
    icon: {
        height: 24,
        width: 16,
        marginLeft: 8,
        marginRight: 8
    },
    logo: {
        height: 150 * scale
    },
    logoSmall: {
        height: 75 * scale
    },
    sideBar: {
        paddingTop: 20,
        backgroundColor: config.colorPrimary
    },
    light: {
        color: '#fff'
    },
    lightGrey: {
        color: '#666666'
    },
    paddedContainer: {
        paddingLeft: Math.max(16, 16 * scale),
        paddingRight: Math.max(16, 16 * scale),
        paddingBottom: Math.max(16, 16 * scale),
        flexGrow: 1,
        backgroundColor: 'white'
    },
    listImage: {
        height: 125 * scale,
        width: 125 * scale
    },
    column: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: Math.max(16, 16 * scale)
    },
    columnSmall: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    row: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 8
    },
    rowSpaceBetween: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8
    },
    rowSmall: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    menuDesc: {
        color: 'gray'
    },
    desc: {
        fontFamily: 'Montserrat-Italic'
    },
    menuItem: {
        fontWeight: 'normal',
        fontFamily: 'Montserrat-Italic'
    },
    bold: {
        fontFamily: 'Montserrat-Bold'
    },
    header: {
        fontFamily: 'Montserrat-Bold',
        paddingBottom: 4
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
        marginTop: Math.max(16, 16 * scale)
    },
    last: {
        paddingBottom: Math.max(16, 16 * scale)
    }
});