const functions = require('firebase-functions');
const admin = require('firebase-admin');

const Status = {
    READY: "READY",
    NOT_READY: "NOT READY",
    PICKED_UP: "PICKED UP"
}

admin.initializeApp(functions.config().firebase);

exports.updateNumActiveOrders = functions.database.ref('/vendor-orders/{vendorId}/orders/{orderId}').onWrite(
    event => {
        let whichData = event.data.previous.exists() ? event.data.previous : event.data;
        let ref = whichData.ref.parent.parent.child('order_count');
        console.log(event.data.previous.val());
        console.log(event.data.val());
        return ref.once('value').then((snap) => {
            let orderCount = snap.val();
            console.log(snap.val());
            orderCount = orderCount ? orderCount : 0;
            if (event.data.previous.exists() && event.data.exists()) { // already existing order
                console.log('update')
                if (event.data.previous.val() === Status.NOT_READY && event.data.val() !== Status.NOT_READY) {
                    return ref.set(orderCount - 1);
                } else if (event.data.previous.val() !== Status.NOT_READY && event.data.val() === Status.NOT_READY) {
                    return ref.set(orderCount + 1);
                }
            } else if (event.data.previous.exists() && !event.data.exists()) { // delete order
                console.log('delete')
                if (event.data.previous.val() === Status.NOT_READY)
                    return ref.set(orderCount - 1);
            } else {
                console.log('new')
                return ref.set(orderCount + 1);
            }
    });
})