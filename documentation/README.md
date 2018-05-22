# Getting Started
Before cloning the repository, ensure you install [React Native's dependencies](https://facebook.github.io/react-native/docs/getting-started.html) and familiarize yourself with the workflow of debugging the app.

You will also need to install the [Firebase CLI](https://firebase.google.com/docs/functions/get-started) if you plan on modifying or adding Firebase Cloud Functions.

Ensure that you run `npm install` in the `app/` directory before doing any development work.

## Directory Structure
Different pages in the app are connected by different routes and navigators used by `react-navigator`. Pages seen by attendees are stored in `app/attendee-pages`, and pages seen by vendors are stored in `app/vendor-pages`. All root-level routes are stored in `app/routes.js`.

## Database Overview
Refer to the JSON files in the `documentation/database/` directory to get an idea of how the database should look before and after the event.
### orders 
Stores information about all orders.
### status
Stores the current status of the event.
- **active**: Determines whether the event is currently active. Used to enable/disable mobile ordering.
### user-orders
Stores relationships between users (attendees) and their orders.
### vendor-orders
Stores relationships between vendors and their orders.
### vendors
Stores all vendor-related information. Vendors are identified by unique user IDs that are generated when creating accounts for them. Any new vendors should have an account created for them in Firebase, with the resulting ID stored as a new key here.