import React, { useState } from "react";
import { connect } from "react-redux";
import { View, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { ToggleButton } from "../../components/common";
import { DietType, General } from "../../state/modules/general/types";
import { ShapeHeader } from "../../components/header";
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

const GoalScreen = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const [general, updateGeneral] = useState(new General());
  const navigate = (type: DietType) => () => {
    const g = general.clone();
    g.diet = type;
    updateGeneral(g);
    navigation.navigate("ActivityLevelScreen", g);
  };
  const { diet } = general;
  return (
    <>
      <ShapeHeader title={t("goal")} />
      <View style={[styles.container]}>
        <ToggleButton
          title={t("loseWeight")}
          style={styles.button}
          on={diet === DietType.Lose}
          onPress={navigate(DietType.Lose)}
        />
        <ToggleButton
          title={t("maintainWeight")}
          style={styles.button}
          on={diet === DietType.Maintain}
          onPress={navigate(DietType.Maintain)}
        />
        <ToggleButton
          title={t("gainWeight")}
          style={styles.button}
          on={diet === DietType.Gain}
          onPress={navigate(DietType.Gain)}
        />
      </View>
    </>
  );
};

export default connect()(GoalScreen);
