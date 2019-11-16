import React, { useState } from "react";
import { connect } from "react-redux";
import { View, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { NavigationScreenProp, NavigationState } from "react-navigation";
import { ToggleButton, DateButton } from "../../components/common";
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
    <ShapeHeader leftComponent={<HeaderBack navigation={navigation} />} title={t("Profile")} />
  );
};

interface Props {
  navigation: Navigation;
}

const ProfileScreen = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const [activeLevel, setActiveLevel] = useState(ActiveLevel.None);
  const [date, onDateChange] = useState(new Date(0));
  const navigate = (lebel: ActiveLevel) => () => {
    setActiveLevel(lebel);
    navigation.navigate("Profile");
  };
  return (
    <>
      <GoalScreenHeader navigation={navigation} />
      <View style={[styles.container]}>
        <View style={[{ flexDirection: "row" }, styles.button]}>
          <ToggleButton
            title={t("Male")}
            style={{ flex: 1 }}
            on={activeLevel === ActiveLevel.NotVeryActive}
            onPress={navigate(ActiveLevel.NotVeryActive)}
          />
          <ToggleButton
            title={t("Female")}
            style={{ flex: 1 }}
            on={activeLevel === ActiveLevel.LightlyActive}
            onPress={navigate(ActiveLevel.LightlyActive)}
          />
        </View>
        <DateButton style={styles.button} date={date} onDateChange={onDateChange} />
        {/* <Button title={t("111111")} style={styles.button} onPress={navigate(ActiveLevel.Active)} /> */}
      </View>
    </>
  );
};

export default connect()(ProfileScreen);
