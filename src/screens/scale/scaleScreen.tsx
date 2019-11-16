import moment from "moment";
import React, { useState } from "react";
import {
  DatePickerAndroid,
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Platform,
  StyleSheet,
  Alert
} from "react-native";
import { Button, Icon, Input } from "react-native-elements";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { NavigationScreenProp, NavigationState } from "react-navigation";
import DatePicker from "./datePicker";
import { THEME_COLOR } from "../../constants";
import { updateWeight } from "../../services/firebase";
import { defaultHealthSelector } from "../../state/modules/health/selector";
import { HealthModel } from "../../state/modules/health/types";
import { ShapeHeader } from "../../components/header";

const margin = 8;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: margin,
    flex: 2,
    justifyContent: "center"
  },
  button: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginHorizontal: 16,
    backgroundColor: THEME_COLOR
  },
  headerLeft: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  dateRowButton: {
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: "white"
  },
  weightInput: {
    textAlign: "center",
    fontSize: 18
  },
  weightContainer: {
    borderBottomWidth: 2,
    borderWidth: 0,
    borderRadius: 0
  }
});

const invalidWeight = () => {
  const { t } = useTranslation();
  Alert.alert(
    t("confirmation"),
    t("weightInvalid"),
    [
      {
        text: t("ok"),
        style: "cancel"
      }
    ],
    { cancelable: true }
  );
};

const isValid = (weight: number) => {
  if (weight > 499) {
    return false;
  }
  if (weight < 0) {
    return false;
  }
  return true;
};

const parseWeight = (weight: string) => {
  const newWeight = parseFloat(weight);
  if (Number.isNaN(newWeight)) {
    return 0;
  }
  return newWeight;
};

const formatWeight = (text: string) => {
  const arr = text.split(".");
  let weight = arr[0];
  if (arr.length > 1) {
    weight = `${arr[0]}.${arr[1].slice(0, 1)}`;
  }
  return weight;
};

const calcWeight = (weight: string, add: number) => `${(parseWeight(weight) * 10 + add * 10) / 10}`;

const ScaleRow = ({
  weight,
  onWeightChange
}: {
  weight: string;
  onWeightChange: (weight: string) => void;
}) => (
  <View style={{ flexDirection: "row" }}>
    <Button
      buttonStyle={styles.button}
      onPress={() => {
        onWeightChange(calcWeight(weight, -0.1));
      }}
      icon={{ type: "feather", color: "white", name: "minus" }}
    />
    <Input
      containerStyle={{ flex: 1, marginRight: 16 }}
      inputStyle={styles.weightInput}
      inputContainerStyle={styles.weightContainer}
      keyboardType="numeric"
      placeholder="00.00"
      onSubmitEditing={() => {
        onWeightChange(`${weight}`);
      }}
      onChangeText={text => {
        onWeightChange(formatWeight(text));
      }}
      maxLength={5}
      value={`${weight}`}
    />
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20 }}>kg</Text>
    </View>
    <Button
      buttonStyle={styles.button}
      onPress={() => {
        onWeightChange(calcWeight(weight, 0.1));
      }}
      icon={{ type: "feather", color: "white", name: "plus" }}
    />
  </View>
);

const DateRow = ({
  date,
  onShowDatePicker,
  onDateChange
}: {
  date: Date;
  onShowDatePicker: (show: boolean) => void;
  onDateChange: (date: Date) => void;
}) => (
  <Button
    buttonStyle={styles.dateRowButton}
    type="outline"
    title={`${moment(date).format("YYYY/MM/DD")}`}
    onPress={async () => {
      if (Platform.OS === "ios") {
        onShowDatePicker(true);
      } else {
        try {
          const result = await DatePickerAndroid.open({
            date
          });
          if (result.action !== DatePickerAndroid.dismissedAction) {
            const { year, month, day } = result;
            onDateChange(new Date(year, month, day));
          } else {
            onDateChange(date);
          }
        } catch ({ code, message }) {
          console.warn("Cannot open date picker", message);
        }
      }
    }}
  />
);

const ScaleScreenHeader = ({
  navigation,
  weight,
  date
}: {
  navigation: NavigationScreenProp<NavigationState>;
  weight: number;
  date: Date;
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
          <View style={{ top: -3 }}>
            <Icon type="font-awesome" size={40} color={THEME_COLOR} name="angle-left" />
          </View>
          <Text style={{ left: 4, fontSize: 18, color: THEME_COLOR }}>{t("back")}</Text>
        </TouchableOpacity>
      )}
      title={t("weightProgress")}
      rightComponent={(
        <TouchableOpacity
          onPress={() => {
            if (isValid(weight)) {
              updateWeight(date, weight);
              navigation.goBack();
            } else {
              invalidWeight();
            }
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", color: THEME_COLOR }}>{t("save")}</Text>
        </TouchableOpacity>
      )}
      containerStyle={{
        backgroundColor: "white"
      }}
    />
  );
};

interface ScaleScreenProp {
  navigation: NavigationScreenProp<NavigationState>;
  healthModel: HealthModel;
}

const ScaleScreen = ({ navigation, healthModel }: ScaleScreenProp) => {
  const [date, onDateChange] = useState(healthModel.date);
  const [newWeight, onWeightChange] = useState(`${healthModel.weight}`);
  const [showDatePicker, onShowDatePicker] = useState(false);

  return (
    <>
      <ScaleScreenHeader navigation={navigation} date={date} weight={parseWeight(newWeight)} />
      <View style={{ borderColor: "lightgrey", borderWidth: 1, height: 1 }} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
            onWeightChange(`${newWeight}`);
          }}
          accessible={false}
        >
          <View style={styles.container}>
            <DateRow date={date} onDateChange={onDateChange} onShowDatePicker={onShowDatePicker} />
            <ScaleRow weight={newWeight} onWeightChange={onWeightChange} />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <DatePicker
        visible={showDatePicker}
        defaultDate={date}
        onCancel={() => {
          onShowDatePicker(false);
        }}
        onDone={(newDate: Date) => {
          onDateChange(newDate);
          onShowDatePicker(false);
        }}
        maximumDate={moment().toDate()}
      />
    </>
  );
};

export default connect((state, props: ScaleScreenProp) => ({
  healthModel: defaultHealthSelector(state, props.navigation.getParam("key"))
}))(ScaleScreen);
