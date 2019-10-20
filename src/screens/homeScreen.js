"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var moment_1 = require("moment");
var react_1 = require("react");
var react_native_1 = require("react-native");
var react_native_elements_1 = require("react-native-elements");
var react_native_swipeout_1 = require("react-native-swipeout");
var react_native_device_info_1 = require("react-native-device-info");
var react_redux_1 = require("react-redux");
var common_1 = require("../components/common");
var chart_1 = require("../components/chart");
var constants_1 = require("../constants");
var icon_1 = require("../../fonts/icon");
var actions_1 = require("../state/modules/health/actions");
var firebase_1 = require("../services/firebase");
var width = react_native_1.Dimensions.get("window").width;
var hasNotch = react_native_device_info_1["default"].hasNotch();
var styles = react_native_1.StyleSheet.create({
    headerContainer: { zIndex: 200, backgroundColor: "white" },
    headerTitle: { fontSize: 18, color: constants_1.BLACK },
    headerButtonText: { fontSize: 18, fontWeight: "bold", color: constants_1.THEME_COLOR },
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
var graph;
var list;
var sectionHeight;
var issectionList;
var STATUS_ICON = {
    UP: {
        name: "up",
        color: constants_1.THEME_COLOR
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
var Empty = function (_a) {
    var navigation = _a.navigation;
    return (<react_native_1.View style={styles.emptyContainer}>
    <react_native_elements_1.Text style={styles.title}>今日の体重を記録しよう！</react_native_elements_1.Text>
    <react_native_elements_1.Icon type="material-community" size={60} color="black" name="scale-bathroom" containerStyle={styles.emptyIcon}/>
    <common_1.Button title="計測" style={styles.button} onPress={function () { return navigation.navigate("Scale", { type: "create" }); }}/>
  </react_native_1.View>);
};
var Content = function (_a) {
    var health = _a.health, navigation = _a.navigation;
    return (<>
    <react_native_1.View style={styles.contentContainer}/>
    <chart_1["default"] health={health} graphRef={function (ref) {
        graph = ref;
    }} scrollListToLocation={function (ratio) {
        return list.scrollToLocation({
            animated: true,
            sectionIndex: 0,
            itemIndex: ratio,
            viewPosition: 0
        });
    }}/>
    <react_native_1.SectionList ref={function (ref) {
        list = ref;
    }} style={styles.sectionList} getItemLayout={function (data, index) { return ({
        length: 50,
        offset: 50 * index,
        index: index
    }); }} onContentSizeChange={function (w, h) {
        sectionHeight = h;
    }} onScroll={function (e) {
        var len = health.length;
        var chartWidth = Math.max(width, len * 50);
        var scrollAmount = sectionHeight - (e.nativeEvent.contentOffset.y + 343.5);
        var ratio = chartWidth / sectionHeight;
        if (issectionList) {
            graph.scrollTo({ x: scrollAmount * ratio + 10 });
        }
    }} onMomentumScrollBegin={function () {
        issectionList = true;
    }} onMomentumScrollEnd={function () {
        issectionList = false;
    }} sections={[
        {
            title: moment_1["default"]().format("MMMM"),
            data: __spreadArrays(health)
        }
    ]} renderItem={function (_a) {
        var item = _a.item, index = _a.index;
        var weightStatusIcon = STATUS_ICON.EVEN;
        if (health.length > index + 1) {
            var diff = health[index].weight - health[index + 1].weight;
            if (diff > 0) {
                weightStatusIcon = STATUS_ICON.UP;
            }
            else if (diff < 0) {
                weightStatusIcon = STATUS_ICON.DOWN;
            }
        }
        return (<react_native_swipeout_1["default"] autoClose backgroundColor="red" right={[
            {
                text: "Delete",
                backgroundColor: "red",
                color: "white",
                underlayColor: "red",
                onPress: function () {
                    firebase_1.deleteWeight(item.date.toDate());
                }
            }
        ]}>
            <react_native_elements_1.ListItem onPress={function () {
            return navigation.navigate("Scale", {
                type: "update",
                date: item.date.toDate(),
                weight: "" + item.weight
            });
        }} style={styles.listItem} title={moment_1["default"](item.date.toDate()).format("YYYY/MM/DD")} topDivider rightTitle={<react_native_1.View style={{ flexDirection: "row" }}>
                  <react_native_elements_1.Text style={styles.rightTitleText}>
                    {item.weight + "kg"}
                  </react_native_elements_1.Text>
                  <icon_1["default"] style={styles.icon} size={20} color={weightStatusIcon.color} name={weightStatusIcon.name}/>
                </react_native_1.View>}/>
          </react_native_swipeout_1["default"]>);
    }} renderSectionHeader={function () { return <react_native_1.View style={styles.sectionHeader}/>; }} keyExtractor={function (item, index) { return item + index; }}/>
  </>);
};
var Container = function (_a) {
    var health = _a.health, navigation = _a.navigation;
    if (health.loading) {
        return <></>;
    }
    return health.length ? (<Content health={health} navigation={navigation}/>) : (<Empty navigation={navigation}/>);
};
var HomeScreen = function (_a) {
    var health = _a.health, navigation = _a.navigation, handleFetchWeights = _a.handleFetchWeights;
    react_1.useEffect(function () {
        handleFetchWeights();
    }, []);
    return (<react_native_1.View style={{ flex: 1 }}>
      <react_native_elements_1.Header containerStyle={styles.headerContainer} centerComponent={<react_native_elements_1.Text style={styles.headerTitle}>体重記録</react_native_elements_1.Text>} rightComponent={<react_native_1.TouchableOpacity onPress={function () {
        navigation.navigate("Scale", { type: "create" });
    }}>
            <react_native_elements_1.Text style={styles.headerButtonText}>追加</react_native_elements_1.Text>
          </react_native_1.TouchableOpacity>}/>

      <Container health={health} navigation={navigation}/>
    </react_native_1.View>);
};
exports["default"] = react_redux_1.connect(function (state) { return ({ auth: state.auth, health: state.health.data }); }, { handleFetchWeights: actions_1.fetchWeights })(HomeScreen);
