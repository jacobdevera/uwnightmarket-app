import firebase from 'firebase';
import { Alert } from 'react-native';

export const isEventActive = async () => {
    let snapshot = await firebase.database().ref(`/status/`).once('value');
    let status = snapshot.val();
    if (status && !status.active) {
        Alert.alert(
            'Oops',
            'Looks like the night market has not started yet. You will not be able to order at this time.',
            [
                {text: 'OK', style: 'cancel'}
            ]
        );
    }
    return status.active;
}

export const acceptTermsAndConditions = (acceptCallback) => {
    Alert.alert(
        'Do you accept the terms and conditions?',
        'You must accept to continue',
        [
            {text: 'Decline', style: 'cancel'},
            {text: 'Accept', onPress: acceptCallback}
        ]
    );
}