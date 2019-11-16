import React, { useState } from "react";
import { connect } from "react-redux";
import { View, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { NavigationScreenProp, NavigationState } from "react-navigation";
import { ToggleButton } from "../../components/common";
import { DietType } from "../../state/modules/general/types";
import { ShapeHeader, HeaderBack } from "../../components/header";
import { THEME_COLOR } from "../../constants";
import { Navigation } from "../../state/type";

const styles = StyleSheet.create({
  container: {
    marginTop: 60
  },
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

const GoalScreenHeader = ({
  navigation
}: {
  navigation: NavigationScreenProp<NavigationState>;
}) => {
  const { t } = useTranslation();
  return <ShapeHeader leftComponent={<HeaderBack navigation={navigation} />} title={t("goal")} />;
};

interface Props {
  navigation: Navigation;
}

const GoalScreen = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const [diet, setDiet] = useState(DietType.None);
  const navigate = (type: DietType) => () => {
    setDiet(type);
    navigation.navigate("ActivityLevelScreen");
  };
  return (
    <>
      <GoalScreenHeader navigation={navigation} />
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
