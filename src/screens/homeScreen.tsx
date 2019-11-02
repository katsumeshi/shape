import moment from "moment";
import React, { useEffect } from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Icon, ListItem, Text } from "react-native-elements";
import { SwipeListView } from "react-native-swipe-list-view";
import DeviceInfo from "react-native-device-info";
import { connect } from "react-redux";
import { NavigationScreenProp, NavigationState } from "react-navigation";
import { useTranslation } from "react-i18next";
import { Button } from "../components/common";
import Chart from "../components/chart";
import { BLACK, THEME_COLOR } from "../constants";

import ShapeIcon from "../../resources/fonts/icon";

import { fetchWeights } from "../state/modules/health/actions";
import { HealthModel, HealthState } from "../state/modules/health/types";
import { deleteWeight } from "../services/firebase";
import { AuthState } from "../state/modules/auth/types";
import ShapeHeader from "../components/header";

const hasNotch = DeviceInfo.hasNotch();

const styles = StyleSheet.create({
  headerContainer: { zIndex: 200, backgroundColor: "white" },
  headerTitle: { fontSize: 18, color: BLACK },
  headerButtonText: { fontSize: 18, fontWeight: "bold", color: THEME_COLOR },
  icon: {
    width: 25,
    marginLeft: 16,
    textAlign: "center"
  },
  sectionList: {
    position: "absolute",
    top: hasNotch ? 360 : 340,
    left: 0,
    right: 0,
    bottom: 0
  },
  button: {
    marginHorizontal: 16
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center"
  },
  title: {
    alignItems: "center",
    textAlign: "center",
    fontSize: 20
  },
  emptyIcon: {
    marginVertical: 40
  },
  listItem: { height: 50, backgroundColor: "white" },
  contentContainer: { borderColor: "lightgrey", borderWidth: 1, height: 1 },
  sectionHeader: {
    backgroundColor: "lightgrey",
    height: 10
  },
  rightTitleText: { color: "#666", fontSize: 18 },
  deleteText: {
    color: "white",
    textAlign: "right",
    marginRight: 16
  },
  deleteContainer: {
    height: 50,
    backgroundColor: "red",
    justifyContent: "center"
  },
  leftEmptyContainer: { height: 50, backgroundColor: "white", flex: 1 }
});

const STATUS_ICON = {
  UP: {
    name: "up",
    color: THEME_COLOR
  },
  DOWN: {
    name: "down",
    color: "#66B6EA"
  },
  EVEN: {
    name: "even",
    color: "#C4C4C4"
  }
};

const Empty = ({
  navigation
}: {
  navigation: NavigationScreenProp<NavigationState>;
}) => {
  const { t } = useTranslation();
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.title}>{t("addWeightToday")}</Text>
      <Icon
        type="material-community"
        size={60}
        color="black"
        name="scale-bathroom"
        containerStyle={styles.emptyIcon}
      />
      <Button
        title={t("measure")}
        style={styles.button}
        onPress={() => navigation.navigate("Scale", { type: "create" })}
      />
    </View>
  );
};

const getChangeIcon = (health: HealthModel[], index: number) => {
  let weightStatusIcon = STATUS_ICON.EVEN;
  if (health.length > index + 1) {
    const diff = health[index].weight - health[index + 1].weight;
    if (diff > 0) {
      weightStatusIcon = STATUS_ICON.UP;
    } else if (diff < 0) {
      weightStatusIcon = STATUS_ICON.DOWN;
    }
  }
  return weightStatusIcon;
};
const Content = ({
  health,
  navigation
}: {
  health: HealthModel[];
  navigation: NavigationScreenProp<NavigationState>;
}) => {
  const { t } = useTranslation();
  return (
    <>
      <View style={styles.contentContainer} />
      <Chart health={health} />
      <SwipeListView
        data={health}
        renderItem={({ item, index }: { item: HealthModel; index: number }) => {
          const { color, name } = getChangeIcon(health, index);
          return (
            <ListItem
              onPress={() =>
                navigation.navigate("Scale", {
                  type: "update",
                  date: item.date.toDate(),
                  weight: `${item.weight}`
                })
              }
              containerStyle={styles.listItem}
              title={moment(item.date.toDate()).format("YYYY/MM/DD")}
              topDivider
              rightTitle={
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={styles.rightTitleText}
                  >{`${item.weight}kg`}</Text>
                  <ShapeIcon
                    style={styles.icon}
                    size={20}
                    color={color}
                    name={name}
                  />
                </View>
              }
            />
          );
        }}
        renderHiddenItem={({ item }, rowMap) => (
          <TouchableOpacity
            onPress={() => {
              deleteWeight(item.key);
              rowMap[item.key].closeRow();
            }}
          >
            <View style={styles.deleteContainer}>
              <Text style={styles.deleteText}>{t("delete")}</Text>
            </View>
          </TouchableOpacity>
        )}
        disableRightSwipe
        leftOpenValue={0}
        rightOpenValue={-75}
      />
    </>
  );
};

const Container = ({
  health,
  navigation
}: {
  health: HealthState;
  navigation: NavigationScreenProp<NavigationState>;
}) => {
  if (health.loading) {
    return <></>;
  }
  return health.data.length ? (
    <Content health={health.data} navigation={navigation} />
  ) : (
    <Empty navigation={navigation} />
  );
};

const HomeScreen = ({
  health,
  navigation,
  handleFetchWeights
}: {
  health: HealthState;
  navigation: NavigationScreenProp<NavigationState>;
  handleFetchWeights: () => void;
}) => {
  useEffect(() => {
    handleFetchWeights();
  }, []);
  const { t } = useTranslation();

  return (
    <View style={{ flex: 1 }}>
      <ShapeHeader
        containerStyle={styles.headerContainer}
        centerComponent={
          <Text style={styles.headerTitle}>{t("weightProgress")}</Text>
        }
        rightComponent={
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Scale", { type: "create" });
            }}
          >
            <Text style={styles.headerButtonText}>{t("add")}</Text>
          </TouchableOpacity>
        }
      />
      <Container health={health} navigation={navigation} />
    </View>
  );
};

export default connect(
  ({ auth, health }: { auth: AuthState; health: HealthState }) => ({
    auth,
    health
  }),
  { handleFetchWeights: fetchWeights }
)(HomeScreen);
