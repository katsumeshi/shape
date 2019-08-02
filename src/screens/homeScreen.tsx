import moment from "moment";
import React from "react";
import { ActivityIndicator, Dimensions, SectionList, StyleSheet, TouchableOpacity, View, Platform } from "react-native";
import ActionSheet from "react-native-actionsheet";
import { Header, Icon, ListItem, Text } from "react-native-elements";
import firebase from "react-native-firebase";
import Mailer from "react-native-mail";
import styled from "styled-components/native";
const { height, width } = Dimensions.get("window");
import Swipeout from "react-native-swipeout";
import { VictoryAxis, VictoryChart, VictoryLine, VictoryTheme } from "victory-native";
import { Button } from "../components/common";
import { BLACK, THEME_COLOR } from "../constants";

import { ScrollView } from "react-native-gesture-handler";
import { connect } from "react-redux";
import { firestoreConnect, withFirestore } from "react-redux-firebase";
import { compose, withHandlers } from "recompose";

let graph;
let list;
let sectionHeight;
let issectionList;
let isGraphScroll;

const styles = StyleSheet.create({
  container: {
    height: 200,
    width,
    backgroundColor: "#F5FCFF"
  },
  chart: {
    flex: 1
  }
});

const handleEmail = () => {
  Mailer.mail(
    {
      subject: "お問い合わせ・改善要望",
      recipients: ["katsumeshi@gmail.com"],
      body: ""
    },
    (error, event) => {
      console.log(error);
      console.log(event);
    }
  );
};

const Chart = props => {
  const len = props.health.length;
  const chartWidth = Math.max(width, len * 50);
  return (
    <>
      {/* <View style={{ height: "2%" }} /> */}
      <ScrollView
        ref={ref => {
          props.graphRef(ref);
        }}
        onScroll={e => {
          let ratio = len - Math.floor((e.nativeEvent.contentOffset.x + 380) / 50);
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
        alwaysBounceHorizontal={true}
        horizontal={true}
      >
        <View pointerEvents="none">
          <VictoryChart padding={{ top: 20, left: 50, bottom: 40, right: 10 }} theme={VictoryTheme.material} height={250} width={chartWidth}>
            {props.health.length > 1 && (
              <VictoryLine
                style={{
                  data: { stroke: THEME_COLOR },
                  parent: { border: "1px solid #ccc" }
                }}
                data={[...props.health].reverse().map(r => ({
                  x: `${moment(r.date.toDate()).month() + 1}/${moment(r.date.toDate()).date()}`,
                  y: r.weight
                }))}
              />
            )}
            <VictoryAxis tickValues={props.health.map(r => moment(r.date.toDate()).date())} />
          </VictoryChart>
        </View>
      </ScrollView>
      <View
        style={{
          backgroundColor: "white",
          height: 250,
          position: "absolute",
          top: Platform.OS === "ios" ? "12%" : "13%",
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
        top: 340,
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
        const scrollAmount = sectionHeight - (e.nativeEvent.contentOffset.y + 343.5);
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
      renderItem={({ item, index, section }) => (
        <Swipeout
          autoClose
          backgroundColor={"red"}
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
                date: item.date.toDate(),
                weight: item.weight
              })
            }
            style={{ height: 50, backgroundColor: "lightgrey" }}
            title={moment(item.date.toDate()).format("YYYY/MM/DD")}
            topDivider
            rightTitle={`${item.weight}kg`}
          />
        </Swipeout>
      )}
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
      color={"black"}
      name="scale-bathroom"
      containerStyle={{
        marginVertical: 40
      }}
    />
    <Button title={"計測"} onPress={() => props.navigation.navigate("Scale")} />
  </View>
);

const Container = props => {
  if (props.health) {
    return props.health.length > 0 ? <Content {...props} /> : <Empty {...props} />;
  } else {
    return <></>;
  }
};

class HomeScreen extends React.Component {
  public async componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.props.navigation.navigate(user ? "App" : "Auth");
    });
    await new Promise(r => setTimeout(r, 1));
  }

  public render() {
    const options = ["キャンセル", "フィードバックを送る", "ログアウト"];
    return (
      <View style={{ flex: 1 }}>
        <Header
          containerStyle={{ zIndex: 200 }}
          leftComponent={
            <TouchableOpacity
              onPress={() => {
                this.ActionSheet.show();
                // ActionSheetIOS.showActionSheetWithOptions(
                //   {
                //     title: "App Veison: 0.0.1",
                //     options,
                //     destructiveButtonIndex: 2,
                //     cancelButtonIndex: 0
                //   },
                //   buttonIndex => {
                //     if (buttonIndex === 1) {
                //       handleEmail();
                //       /* destructive action */
                //     } else if (buttonIndex === 2) {
                //       firebase.auth().signOut();
                //     }
                //   }
                // );
              }}
            >
              <Icon type="evilicon" size={28} color={THEME_COLOR} name="gear" />
            </TouchableOpacity>
          }
          centerComponent={<Text style={{ fontSize: 18, color: BLACK }}>体重記録</Text>}
          rightComponent={
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("Scale");
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold", color: THEME_COLOR }}>追加</Text>
            </TouchableOpacity>
          }
          containerStyle={{
            backgroundColor: "white"
          }}
        />

        <Container {...this.props} />
        <ActionSheet
          ref={o => (this.ActionSheet = o)}
          title={"App Veison: 0.0.1"}
          options={["キャンセル", "フィードバックを送る", "ログアウト"]}
          cancelButtonIndex={0}
          destructiveButtonIndex={2}
          onPress={index => {
            if (index === 1) {
              handleEmail();
            } else if (index === 2) {
              firebase.auth().signOut();
            }
          }}
        />
      </View>
    );
  }
}

const enhance = compose(
  // withFirestore,
  connect(({ firebase: { auth: { uid } } }) => ({ uid })),
  firestoreConnect(({ uid }) => {
    // console.warn(props);
    return [
      {
        collection: `users/${uid}/health`,
        orderBy: ["date", "desc"]
      }
    ];
  }),
  connect(({ firestore: { ordered } }, { uid }) => {
    return { health: ordered[`users/${uid}/health`] };
  }),
  withHandlers({
    delete: ({ firestore, uid }) => date => {
      firestore.delete({
        collection: `users/${uid}/health`,
        doc: moment(date).format("YYYY-MM-DD")
      });
    }
  })
);

export default enhance(HomeScreen);
