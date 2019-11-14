import React, { useState } from "react";
import { connect } from "react-redux";
import { View, StyleSheet, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native-gesture-handler";
import { NavigationScreenProp, NavigationState } from "react-navigation";
import { Icon } from "react-native-elements";
import { ToggleButton } from "../../components/common";
import { DietType } from "../../state/modules/general/types";
import ShapeHeader from "../../components/header";
import { THEME_COLOR } from "../../constants";
import { Navigation } from "../../state/type";

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: "center"
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
      leftComponent={(
        <TouchableOpacity
          style={styles.headerLeft}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <View style={styles.headerLeftIcon}>
            <Icon type="font-awesome" size={40} color={THEME_COLOR} name="angle-left" />
          </View>
          <Text style={styles.headerLeftText}>{t("back")}</Text>
        </TouchableOpacity>
      )}
      centerComponent={<Text style={styles.headerTitle}>{t("goal")}</Text>}
      containerStyle={{
        backgroundColor: "white"
      }}
    />
  );
};

interface Props {
  navigation: Navigation;
}

const GoalScreen = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const [diet, setDiet] = useState(DietType.None);
  return (
    <>
      <GoalScreenHeader navigation={navigation} />
      <View style={[styles.container]}>
        <ToggleButton
          title={t("loseWeight")}
          style={styles.button}
          on={diet === DietType.Lose}
          onPress={() => setDiet(DietType.Lose)}
        />
        <ToggleButton
          title={t("maintainWeight")}
          style={styles.button}
          on={diet === DietType.Maintain}
          onPress={() => setDiet(DietType.Maintain)}
        />
        <ToggleButton
          title={t("gainWeight")}
          style={styles.button}
          on={diet === DietType.Gain}
          onPress={() => setDiet(DietType.Gain)}
        />
      </View>
    </>
  );
};

export default connect()(GoalScreen);
//   ({ auth }: { auth: AuthState }) => ({ auth })
// { fetchAuth: fetchAuthStatus }
