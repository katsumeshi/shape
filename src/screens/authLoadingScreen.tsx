import React, { useState, useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
// import { requestLoginStatus } from "../redux/modules/auth";
import * as firebaseService from "../services/firebase";
import { connect } from "react-redux";

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

export default connect(
  state => ({ auth: state.auth })
  // { requestLoginStatus }
)(AuthLoadingScreen);
