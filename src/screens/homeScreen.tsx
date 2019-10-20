import moment from "moment";
import React, { useEffect } from "react";
import {
  SectionList,
  TouchableOpacity,
  View,
  Dimensions,
  StyleSheet
} from "react-native";
import { Header, Icon, ListItem, Text } from "react-native-elements";
import Swipeout from "react-native-swipeout";
import DeviceInfo from "react-native-device-info";
import { connect } from "react-redux";
import { NavigationScreenProp, NavigationState } from "react-navigation";
import { Button } from "../components/common";
import Chart from "../components/chart";
import { BLACK, THEME_COLOR } from "../constants";

import ShapeIcon from "../../fonts/icon";

import { fetchWeights } from "../state/modules/health/actions";
import { HealthModel } from "../state/modules/health/types";
import { deleteWeight } from "../services/firebase";

const { width } = Dimensions.get("window");

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
  listItem: { height: 50, backgroundColor: "lightgrey" },
  contentContainer: { borderColor: "lightgrey", borderWidth: 1, height: 1 },
  sectionHeader: {
    backgroundColor: "lightgrey",
    height: 10
  },
  rightTitleText: { color: "#666", fontSize: 18 }
});

let graph;
let list;
let sectionHeight;
let issectionList;

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
}) => (
  <View style={styles.emptyContainer}>
    <Text style={styles.title}>今日の体重を記録しよう！</Text>
    <Icon
      type="material-community"
      size={60}
      color="black"
      name="scale-bathroom"
      containerStyle={styles.emptyIcon}
    />
    <Button
      title="計測"
      style={styles.button}
      onPress={() => navigation.navigate("Scale", { type: "create" })}
    />
  </View>
);
const Content = ({
  health,
  navigation
}: {
  health: HealthModel;
  navigation: NavigationScreenProp<NavigationState>;
}) => (
  <>
    <View style={styles.contentContainer} />
    <Chart
      health={health}
      graphRef={ref => {
        graph = ref;
      }}
      scrollListToLocation={ratio =>
        list.scrollToLocation({
          animated: true,
          sectionIndex: 0,
          itemIndex: ratio,
          viewPosition: 0
        })
      }
    />
    <SectionList
      ref={ref => {
        list = ref;
      }}
      style={styles.sectionList}
      getItemLayout={(data, index) => ({
        length: 50,
        offset: 50 * index,
        index
      })}
      onContentSizeChange={(w, h) => {
        sectionHeight = h;
      }}
      onScroll={e => {
        const len = health.length;
        const chartWidth = Math.max(width, len * 50);
        const scrollAmount =
          sectionHeight - (e.nativeEvent.contentOffset.y + 343.5);
        const ratio = chartWidth / sectionHeight;
        if (issectionList) {
          graph.scrollTo({ x: scrollAmount * ratio + 10 });
        }
      }}
      onMomentumScrollBegin={() => {
        issectionList = true;
      }}
      onMomentumScrollEnd={() => {
        issectionList = false;
      }}
      sections={[
        {
          title: moment().format("MMMM"),
          data: [...health]
        }
      ]}
      renderItem={({ item, index }) => {
        let weightStatusIcon = STATUS_ICON.EVEN;
        if (health.length > index + 1) {
          const diff = health[index].weight - health[index + 1].weight;
          if (diff > 0) {
            weightStatusIcon = STATUS_ICON.UP;
          } else if (diff < 0) {
            weightStatusIcon = STATUS_ICON.DOWN;
          }
        }

        return (
          <Swipeout
            autoClose
            backgroundColor="red"
            right={[
              {
                text: "Delete",
                backgroundColor: "red",
                color: "white",
                underlayColor: "red",
                onPress: () => {
                  deleteWeight(item.date.toDate());
                }
              }
            ]}
          >
            <ListItem
              onPress={() =>
                navigation.navigate("Scale", {
                  type: "update",
                  date: item.date.toDate(),
                  weight: `${item.weight}`
                })
              }
              style={styles.listItem}
              title={moment(item.date.toDate()).format("YYYY/MM/DD")}
              topDivider
              rightTitle={
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.rightTitleText}>
                    {`${item.weight}kg`}
                  </Text>
                  <ShapeIcon
                    style={styles.icon}
                    size={20}
                    color={weightStatusIcon.color}
                    name={weightStatusIcon.name}
                  />
                </View>
              }
            />
          </Swipeout>
        );
      }}
      renderSectionHeader={() => <View style={styles.sectionHeader} />}
      keyExtractor={(item, index) => item + index}
    />
  </>
);

const Container = ({
  health,
  navigation
}: {
  health: HealthModel;
  navigation: NavigationScreenProp<NavigationState>;
}) => {
  if (health.loading) {
    return <></>;
  }
  return health.length ? (
    <Content health={health} navigation={navigation} />
  ) : (
    <Empty navigation={navigation} />
  );
};

const HomeScreen = ({
  health,
  navigation,
  handleFetchWeights
}: {
  health: HealthModel;
  navigation: NavigationScreenProp<NavigationState>;
  handleFetchWeights: () => void;
}) => {
  useEffect(() => {
    handleFetchWeights();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Header
        containerStyle={styles.headerContainer}
        centerComponent={<Text style={styles.headerTitle}>体重記録</Text>}
        rightComponent={
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Scale", { type: "create" });
            }}
          >
            <Text style={styles.headerButtonText}>追加</Text>
          </TouchableOpacity>
        }
      />

      <Container health={health} navigation={navigation} />
    </View>
  );
};

export default connect(
  state => ({ auth: state.auth, health: state.health.data }),
  { handleFetchWeights: fetchWeights }
)(HomeScreen);
