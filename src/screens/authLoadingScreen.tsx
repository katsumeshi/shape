import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import * as firebaseService from "../services/firebase";


const AuthLoadingScreen = props => {
  useEffect(() => {
    firebaseService.observeAuthState();
  }, []);

  useEffect(() => {
    if (props.auth.isLoggedIn !== undefined) {
      props.navigation.navigate(props.auth.isLoggedIn ? "App" : "Auth");
    }
  });

  return (
    <View style={[styles.container, styles.horizontal]}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  }
});

export default connect(state => ({ auth: state.auth }))(AuthLoadingScreen);
