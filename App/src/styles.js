import { StyleSheet, Dimensions, Platform } from "react-native";

const { height, width } = Dimensions.get('window');
const isIphoneX = Platform.OS === "ios" && height === 812 && width === 375;

export const scale = parseInt(width) / 414; // 414: iPhone 6 Plus width
export const config = {
    colorPrimary: '#d94d5d',
    colorDark: '#a21334',
    textDark: '#2a2a2a'
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
        width: 16
    },
    logo: {
        height: 150 * scale
    },
    logoSmall: {
        height: 75 * scale
    },
    sideBar: {
        paddingTop: isIphoneX ? 39 : 20,
        backgroundColor: config.colorPrimary,
        flex: 1
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
        height: 96 * scale,
        width: 96 * scale
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
        alignItems: 'flex-start'
    },
    menuDesc: {
        color: 'gray'
    },
    desc: {
        fontFamily: 'Montserrat-Italic',
        fontSize: 14
    },
    menuItem: {
        fontFamily: 'Montserrat-Italic',
        fontSize: 14
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
    cardH3: {
        fontSize: 12
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
    link: {
        color: config.colorPrimary
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
    smallSection: {
        marginTop: Math.max(8, 8 * scale)
    },
    last: {
        paddingBottom: Math.max(16, 16 * scale)
    },
    orderNumberLarge: {
        fontSize: Math.max(96, scale * 96)
    }
});

export const modalStyles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)'
    },
    innerContainer: {
        flex: 1,
        marginLeft: Math.max(32, 32 * scale),
        marginRight: Math.max(32, 32 * scale),
        marginTop: Math.max(128, 128 * scale),
        marginBottom: Math.max(128, 128 * scale),
        backgroundColor: 'white',
        borderRadius: 8
    },
});