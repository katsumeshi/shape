import React, { useState } from "react";
import { connect } from "react-redux";
import { View, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { NavigationScreenProp, NavigationState } from "react-navigation";
import { ToggleButton } from "../../components/common";
import { ActiveLevel } from "../../state/modules/general/types";
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
  return (
    <ShapeHeader
      leftComponent={<HeaderBack navigation={navigation} />}
      title={t("Activity Level")}
    />
  );
};

interface Props {
  navigation: Navigation;
}

const ActivityLevelScreen = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const [activeLevel, setActiveLevel] = useState(ActiveLevel.None);
  const navigate = (a: ActiveLevel) => () => {
    setActiveLevel(a);
    navigation.navigate("ProfileScreen");
  };
  return (
    <>
      <GoalScreenHeader navigation={navigation} />
      <View style={[styles.container]}>
        <ToggleButton
          title={t("Not Very Active")}
          style={styles.button}
          on={activeLevel === ActiveLevel.NotVeryActive}
          onPress={navigate(ActiveLevel.NotVeryActive)}
        />
        <ToggleButton
          title={t("Lightly Active")}
          style={styles.button}
          on={activeLevel === ActiveLevel.LightlyActive}
          onPress={navigate(ActiveLevel.LightlyActive)}
        />
        <ToggleButton
          title={t("Active")}
          style={styles.button}
          on={activeLevel === ActiveLevel.Active}
          onPress={navigate(ActiveLevel.Active)}
        />
        <ToggleButton
          title={t("Very Active")}
          style={styles.button}
          on={activeLevel === ActiveLevel.VeryActive}
          onPress={navigate(ActiveLevel.VeryActive)}
        />
      </View>
    </>
  );
};

export default connect()(ActivityLevelScreen);
//   ({ auth }: { auth: AuthState }) => ({ auth })
// { fetchAuth: fetchAuthStatus }
