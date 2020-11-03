import React from "react";
import { connect } from "react-redux";
import { View, StyleSheet, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/common";
import { ShapeHeader, HeaderBack } from "../../components/header";
import { THEME_COLOR } from "../../constants";
import { Navigation } from "../../state/type";

const styles = StyleSheet.create({
  container: { justifyContent: "center", flex: 1 },
  button: {
    marginHorizontal: 16,
    marginBottom: 8
  },
  checkbox: { height: 60 },
  headerLeft: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  headerLeftIcon: { top: -3, marginRight: 8 },
  headerLeftText: { fontSize: 18, color: THEME_COLOR },
  headerTitle: { fontSize: 18, color: "black" }
});

const CompleteScreenHeader = () => {
  const { t } = useTranslation();
  return <ShapeHeader leftComponent={<HeaderBack />} title={t("Complete Screen")} />;
};

interface Props {
  navigation: Navigation;
}

const CompleteScreen = ({ navigation }: Props) => {
  return (
    <>
      <CompleteScreenHeader />
      <View style={[styles.container]}>
        <View style={{ justifyContent: "space-between", flex: 1, marginVertical: 60 }}>
          <Text style={{ textAlign: "center", fontSize: 20 }}>Congratulations!</Text>
          <Text style={{ textAlign: "center", fontSize: 25 }}>1970kcal</Text>
          <Button
            style={styles.button}
            title="続ける"
            onPress={() => {
              // const { params } = navigation.state;
              console.warn(navigation.state.params);
            }}
          />
        </View>
      </View>
    </>
  );
};

export default connect()(CompleteScreen);
