const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

// get attendee-specific orders using their token to get their id
exports.getOrders = functions.https.onRequest((req, res) => {
    let ordersRef = admin.database().ref('/orders');
    const idToken = req.get('Authorization').split('Bearer ')[1];

    return admin.auth().verifyIdToken(idToken).then((decodedToken) => {
        let uid = decodedToken.uid;
        return ordersRef.once('value', (snapshot) => {
            let orders = [];
            snapshot.forEach((vendorSnapshot) => {
                vendorSnapshot.forEach((orderSnapshot) => {
                    let order = orderSnapshot.val();
                    if (order.userId === uid) {
                        orders.push(order);
                    }
                });
            });
            return res.status(200).send(orders);
        });
    }).catch((error) => {
        console.log(error);
    }
    );
})