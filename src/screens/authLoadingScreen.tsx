import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import {
  NavigationState,
  NavigationScreenProp,
  NavigationParams
} from "react-navigation";
import { AuthState } from "../state/modules/auth/types";
// import { fetchAuthStatus } from "../state/modules/auth/actions";

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

const AuthLoadingScreen = ({
  fetchAuth,
  auth,
  navigation
}: {
  fetchAuth: () => void;
  auth: AuthState;
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}) => {
  return (
    <View style={[styles.container, styles.horizontal]}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

export default connect(
  ({ auth }: { auth: AuthState }) => ({ auth })
  // { fetchAuth: fetchAuthStatus }
)(AuthLoadingScreen);
