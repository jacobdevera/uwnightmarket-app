import { StyleSheet, Dimensions, Platform } from "react-native";

const { height, width } = Dimensions.get('window');
const isIphoneX = Platform.OS === "ios" && height === 812 && width === 375;

const guidelineBaseWidth = 414; // iPhone 6 Plus dimensions
const guidelineBaseHeight = 736;

export const horizontalScale = size => width / guidelineBaseWidth * size;
export const verticalScale = size => height / guidelineBaseHeight * size;
export const moderateScale = (size, factor = 0.5) => size + (horizontalScale(size) - size) * factor;

export const scale = parseInt(width) / guidelineBaseWidth; 
export const scaleVert = parseInt(width) / guidelineBaseHeight;
export const config = {
    colorPrimary: '#d94d5d',
    colorDark: '#a21334',
    backgroundDark: '#aeaeae',
    textDark: '#2a2a2a',
    textLight: '#666666'
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
    bgContainer: { 
        flex: 1, 
        width: null, 
        height: null 
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
    listImageLarge: {
        height: 200 * scale,
        width: 200 * scale
    },
    column: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: moderateScale(16)
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
        padding: moderateScale(8)
    },
    rowSpaceBetween: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: moderateScale(8)
    },
    rowSmall: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    desc: {
        color: config.textLight,
        fontSize: moderateScale(14, 0.25)
    },
    menuItem: {
        fontFamily: 'Montserrat-Italic',
        fontSize: moderateScale(14, 0.25)
    },
    bold: {
        fontFamily: 'Montserrat-Bold'
    },
    header: {
        fontFamily: 'Montserrat-Bold',
        paddingBottom: 4
    },
    cardH1: {
        fontSize: moderateScale(18, 0.25)
    },
    cardH2: {
        fontSize: moderateScale(14, 0.25)
    },
    cardH3: {
        fontSize: moderateScale(12, 0.25)
    },
    mapText: {
        fontSize: moderateScale(12, 0.25)
    },
    h1: {
        fontSize: moderateScale(24, 0.25) 
    },
    h2: {
        fontSize: moderateScale(20, 0.25)
    },
    h3: {
        fontSize: moderateScale(16, 0.25)
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
    },
    badge: {
        backgroundColor: config.colorPrimary, marginRight: 8, justifyContent: 'center'
    },
    mapNotifBox: {
        position: "absolute",
        height: 56,
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: config.colorPrimary,
        justifyContent: 'center'
    },
    mapNotifBoxText: {
        fontFamily: 'Montserrat-Bold',
        color: '#fff',
        paddingLeft: 30
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
        marginLeft: moderateScale(32),
        marginRight: moderateScale(32),
        marginTop: verticalScale(98),
        marginBottom: verticalScale(98),
        backgroundColor: 'white',
        borderRadius: 8
    },
});