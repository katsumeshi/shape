import moment from "moment";
import React, { useEffect } from "react";
import { Dimensions, SectionList, TouchableOpacity, View } from "react-native";
import { Header, Icon, ListItem, Text } from "react-native-elements";
import Swipeout from "react-native-swipeout";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryTheme
} from "victory-native";
import DeviceInfo from "react-native-device-info";
import { ScrollView } from "react-native-gesture-handler";
import { connect } from "react-redux";
import { Button } from "../components/common";
import { BLACK, THEME_COLOR } from "../constants";

import ShapeIcon from "../../fonts/icon";

import { requestWeights } from "../redux/modules/health";

const { width } = Dimensions.get("window");

const hasNotch = DeviceInfo.hasNotch();

let graph;
let list;
let sectionHeight;
let issectionList;
let isGraphScroll;

const Chart = props => {
  const len = props.health.length;
  const chartWidth = Math.max(width, len * 50);
  return (
    <>
      <ScrollView
        ref={ref => {
          props.graphRef(ref);
        }}
        onScroll={e => {
          let ratio =
            len - Math.floor((e.nativeEvent.contentOffset.x + 380) / 50);
          if (ratio < 0) {
            ratio = 0;
          }
          if (isGraphScroll) {
            props.scrollListToLocation(ratio);
          }
        }}
        onScrollBeginDrag={() => (isGraphScroll = true)}
        onScrollEndDrag={() => (isGraphScroll = false)}
        onMomentumScrollBegin={() => (isGraphScroll = true)}
        onMomentumScrollEnd={() => (isGraphScroll = false)}
        onContentSizeChange={() => graph.scrollToEnd({ animated: false })}
        style={{ height: 500 }}
        contentContainerStyle={{ width: chartWidth }}
        alwaysBounceVertical={false}
        alwaysBounceHorizontal
        horizontal
      >
        <View pointerEvents="none">
          <VictoryChart
            padding={{ top: 20, left: 50, bottom: 40, right: 10 }}
            theme={VictoryTheme.material}
            height={250}
            width={chartWidth}
          >
            {props.health.length > 1 && (
              <VictoryLine
                style={{
                  data: { stroke: THEME_COLOR },
                  parent: { border: "1px solid #ccc" }
                }}
                data={[...props.health].reverse().map(r => ({
                  x: `${moment(r.date.toDate()).month() + 1}/${moment(
                    r.date.toDate()
                  ).date()}`,
                  y: r.weight
                }))}
              />
            )}
            <VictoryAxis
              tickValues={props.health.map(r => moment(r.date.toDate()).date())}
            />
          </VictoryChart>
        </View>
      </ScrollView>
      <View
        style={{
          backgroundColor: "white",
          height: 250,
          position: "absolute",
          top: hasNotch ? 95 : 70,
          width: 50
        }}
      >
        <VictoryAxis
          orientation="left"
          padding={{ top: 20, left: 50, bottom: 20, right: 10 }}
          height={230}
          tickValues={(() => {
            let max = 0;
            let min = 999;
            props.health.forEach(r => {
              if (r.weight < min) {
                min = r.weight;
              }
              if (r.weight > max) {
                max = r.weight;
              }
            });
            const count = Math.min(props.health.length, 5);
            const avg = (max - min) / (count - 1);
            const d = [];
            for (let i = 0; i < count; i++) {
              d.unshift(min.toFixed(1));
              min += avg;
            }
            return d;
          })()}
        />
      </View>
    </>
  );
};

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
const Content = props => (
  <>
    <View style={{ borderColor: "lightgrey", borderWidth: 1, height: 1 }} />
    <Chart
      {...props}
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
      style={{
        position: "absolute",
        top: hasNotch ? 360 : 340,
        left: 0,
        right: 0,
        bottom: 0
      }}
      getItemLayout={(data, index) => ({
        length: 50,
        offset: 50 * index,
        index
      })}
      onContentSizeChange={(w, h) => {
        sectionHeight = h;
      }}
      onScroll={e => {
        const len = props.health.length;
        const chartWidth = Math.max(width, len * 50);
        const scrollAmount =
          sectionHeight - (e.nativeEvent.contentOffset.y + 343.5);
        const ratio = chartWidth / sectionHeight;
        if (issectionList) {
          graph.scrollTo({ x: scrollAmount * ratio + 10 });
        }
      }}
      onMomentumScrollBegin={() => (issectionList = true)}
      onMomentumScrollEnd={() => (issectionList = false)}
      sections={[
        {
          title: moment().format("MMMM"),
          data: [...props.health]
        }
      ]}
      renderItem={({ item, index, section }) => {
        let weightStatusIcon = STATUS_ICON.EVEN;
        if (props.health.length > index + 1) {
          const diff =
            props.health[index].weight - props.health[index + 1].weight;
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
                  props.delete(item.date.toDate());
                }
              }
            ]}
          >
            <ListItem
              onPress={() =>
                props.navigation.navigate("Scale", {
                  type: "update",
                  date: item.date.toDate(),
                  weight: `${item.weight}`
                })
              }
              style={{ height: 50, backgroundColor: "lightgrey" }}
              title={moment(item.date.toDate()).format("YYYY/MM/DD")}
              topDivider
              rightTitle={
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={{ color: "#666", fontSize: 18 }}
                  >{`${item.weight}kg`}</Text>
                  <ShapeIcon
                    style={{ width: 25, marginLeft: 16, textAlign: "center" }}
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
      renderSectionHeader={({ section: { title } }) => (
        <View
          style={{
            fontWeight: "bold",
            backgroundColor: "lightgrey",
            height: 10
          }}
        />
      )}
      keyExtractor={(item, index) => item + index}
    />
  </>
);

const Empty = props => (
  <View
    style={{
      flex: 1,
      justifyContent: "center"
    }}
  >
    <Text
      style={{
        alignItems: "center",
        textAlign: "center",
        fontSize: 20
      }}
    >
      今日の体重を記録しよう！
    </Text>
    <Icon
      type="material-community"
      size={60}
      color="black"
      name="scale-bathroom"
      containerStyle={{
        marginVertical: 40
      }}
    />
    <Button
      title="計測"
      onPress={() => props.navigation.navigate("Scale", { type: "create" })}
    />
  </View>
);

const Container = props => {
  if (props.health) {
    return props.health.length > 0 ? (
      <Content {...props} />
    ) : (
      <Empty {...props} />
    );
  }
  return <></>;
};

const HomeScreen = props => {
  useEffect(() => {
    props.requestWeights();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Header
        containerStyle={{ zIndex: 200 }}
        centerComponent={
          <Text style={{ fontSize: 18, color: BLACK }}>体重記録</Text>
        }
        rightComponent={
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate("Scale", { type: "create" });
            }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: "bold", color: THEME_COLOR }}
            >
              追加
            </Text>
          </TouchableOpacity>
        }
        containerStyle={{
          backgroundColor: "white"
        }}
      />

      <Container {...props} />
    </View>
  );
};

export default connect(
  state => ({ auth: state.auth, health: state.health.data }),
  { requestWeights }
)(HomeScreen);
