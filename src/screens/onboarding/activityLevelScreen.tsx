import React, { useState } from "react";
import { connect } from "react-redux";
import { View, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { ToggleButton } from "../../components/common";
import { ActiveLevel } from "../../state/modules/general/types";
import { ShapeHeader, HeaderBack } from "../../components/header";
import { Navigation } from "../../state/type";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },
  button: {
    marginHorizontal: 16,
    marginBottom: 8
  }
});

interface Props {
  navigation: Navigation;
}

const ActivityLevelScreen = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const [activeLevel, setActiveLevel] = useState(ActiveLevel.None);
  const navigate = (value: ActiveLevel) => () => {
    setActiveLevel(value);
    navigation.navigate("ProfileScreen", {
      ...navigation.state.params,
      activeLevel: value
    });
  };
  return (
    <>
      <ShapeHeader leftComponent={<HeaderBack />} title={t("activityLevel")} />
      <View style={[styles.container]}>
        <ToggleButton
          title={t("notVeryActive")}
          style={styles.button}
          on={activeLevel === ActiveLevel.NotVeryActive}
          onPress={navigate(ActiveLevel.NotVeryActive)}
        />
        <ToggleButton
          title={t("lightlyActive")}
          style={styles.button}
          on={activeLevel === ActiveLevel.LightlyActive}
          onPress={navigate(ActiveLevel.LightlyActive)}
        />
        <ToggleButton
          title={t("active")}
          style={styles.button}
          on={activeLevel === ActiveLevel.Active}
          onPress={navigate(ActiveLevel.Active)}
        />
        <ToggleButton
          title={t("veryActive")}
          style={styles.button}
          on={activeLevel === ActiveLevel.VeryActive}
          onPress={navigate(ActiveLevel.VeryActive)}
        />
      </View>
    </>
  );
};

export default connect()(ActivityLevelScreen);
