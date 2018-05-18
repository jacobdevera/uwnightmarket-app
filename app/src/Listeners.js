import { Platform, AsyncStorage, AppState } from 'react-native';

import FCM, { FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType, NotificationActionType, NotificationActionOption, NotificationCategoryOption } from "react-native-fcm";

AsyncStorage.getItem('lastNotification').then(data => {
    if (data) {
        // if notification arrives when app is killed, it should still be logged here
        console.log('last notification', JSON.parse(data));
        AsyncStorage.removeItem('lastNotification');
    }
})

AsyncStorage.getItem('lastMessage').then(data => {
    if (data) {
        // if notification arrives when app is killed, it should still be logged here
        console.log('last message', JSON.parse(data));
        AsyncStorage.removeItem('lastMessage');
    }
})

export function registerKilledListener() {
    // these callback will be triggered even when app is killed
    FCM.on(FCMEvent.Notification, notif => {
        AsyncStorage.setItem('lastNotification', JSON.stringify(notif));
        if (notif.opened_from_tray) {
            setTimeout(() => {
                if (notif._actionIdentifier === 'reply') {
                    if (AppState.currentState !== 'background') {
                        console.log('User replied ' + JSON.stringify(notif._userText))
                        alert('User replied ' + JSON.stringify(notif._userText));
                    } else {
                        AsyncStorage.setItem('lastMessage', JSON.stringify(notif._userText));
                    }
                }
                if (notif._actionIdentifier === 'view') {
                    alert("User clicked View in App");
                }
                if (notif._actionIdentifier === 'dismiss') {
                    alert("User clicked Dismiss");
                }
            }, 1000)
        }
    });
}