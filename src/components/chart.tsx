import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryTheme
} from "victory-native";
import moment from "moment";
import { ScrollView, View, Dimensions } from "react-native";
import React from "react";
import DeviceInfo from "react-native-device-info";
import { THEME_COLOR } from "../constants";

const { width } = Dimensions.get("window");
const hasNotch = DeviceInfo.hasNotch();
let graph;
let isGraphScroll = false;

const Chart = props => {
  const len = props.health.length;
  const chartWidth = Math.max(width, len * 50);
  return (
    <>
      <ScrollView
        ref={ref => {
          graph = ref;
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
        onScrollBeginDrag={() => {
          isGraphScroll = true;
        }}
        onScrollEndDrag={() => {
          isGraphScroll = false;
        }}
        onMomentumScrollBegin={() => {
          isGraphScroll = true;
        }}
        onMomentumScrollEnd={() => {
          isGraphScroll = false;
        }}
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
            for (let i = 0; i < count; i += 1) {
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

export default Chart;
