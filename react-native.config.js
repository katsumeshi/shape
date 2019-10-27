module.exports = {
  dependencies: {
    "react-native-notifications": {
      platforms: {
        android: {
          packageInstance: "new RNNotificationsPackage(this.getApplication())"
        }
      }
    }
  }
};
