import React from "react";
import { DatePickerIOS, Dimensions, View } from "react-native";
import { Button, Icon, Input } from "react-native-elements";
const { height, width } = Dimensions.get("window");
const margin = 8;
const BUTTON_WIDTH = width / 3 - margin;

const DatePickerPanel = ({ date, onCancel, onDone, onDateChange }) => (
  <View style={{ backgroundColor: "white" }}>
    <View style={{ backgroundColor: "rgba(0, 0, 0, 0.03)" }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 8
        }}
      >
        <Button title="Cancel" type="clear" onPress={onCancel} />
        <Button title="Done" type="clear" onPress={onDone} />
      </View>
    </View>
    <DatePickerIOS date={date} mode="date" onDateChange={onDateChange} />
  </View>
);

export default class DatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: props.date
    };
  }
  public render() {
    return (
      <View
        style={{
          height,
          width,
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          justifyContent: "flex-end"
        }}
      >
        <DatePickerPanel
          date={this.state.date}
          onDateChange={date => {
            this.setState({ date });
          }}
          onCancel={this.props.onCancel}
          onDone={() => this.props.onDone(this.state.date)}
        />
      </View>
    );
  }
}
