import React, { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { connect } from "react-redux";
import { View, StyleSheet, Text, Picker, DatePickerIOS } from "react-native";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { TouchableOpacity } from "react-native-gesture-handler";
import range from "lodash/range";
import get from "lodash/get";
import { ToggleButton } from "../../components/common";
import { ActiveLevel } from "../../state/modules/general/types";
import { ShapeHeader, HeaderBack, HeaderNext } from "../../components/header";
import { Navigation } from "../../state/type";
import NavigationService from "../../../NavigationService";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },
  button: {
    marginHorizontal: 16,
    marginBottom: 8
  },
  title: {
    textAlign: "center",
    fontSize: 16,
    marginVertical: 16
  }
});

interface Props {
  navigation: Navigation;
}

const Field = ({
  onShowPicker,
  title,
  value
}: {
  onShowPicker: () => void;
  title: string;
  value: string;
}) => (
  <View
    style={{
      marginHorizontal: 16,
      marginVertical: 8
    }}
  >
    <TouchableOpacity
      style={{
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "lightgray",
        justifyContent: "space-between"
      }}
      onPress={onShowPicker}
    >
      <Text style={{ fontWeight: "bold", color: "dimgray", marginBottom: 4 }}>
        {title.toLocaleUpperCase()}
      </Text>
      <Text>{value}</Text>
    </TouchableOpacity>
  </View>
);

const BirthdayPicker = forwardRef(({ title }: { title: string }, ref) => {
  const [date, onDateChange] = useState(new Date(0));
  const [show, onShowPicker] = useState(false);
  useImperativeHandle(ref, () => ({ value: date }));
  return (
    <>
      <Field
        onShowPicker={() => onShowPicker(!show)}
        title={title}
        value={moment(date).format("LL")}
      />
      {show && (
        <DatePickerIOS
          style={{
            marginHorizontal: 16
          }}
          mode="date"
          date={date}
          onDateChange={onDateChange}
          minimumDate={new Date(1900, 1, 1)}
          maximumDate={new Date()}
        />
      )}
    </>
  );
});

const HeightPicker = forwardRef(({ title }: { title: string }, ref) => {
  const [height, onChangeHeight] = useState(160);
  const [show, onShowPicker] = useState(false);
  useImperativeHandle(ref, () => ({ value: height }));
  return (
    <>
      <Field onShowPicker={() => onShowPicker(!show)} title={title} value={`${height} cm`} />
      {show && (
        <View style={{ flexDirection: "row", marginHorizontal: 16 }}>
          <Picker
            selectedValue={height}
            onValueChange={itemValue => {
              onChangeHeight(itemValue);
            }}
            style={{ width: "100%" }}
          >
            {range(120, 221).map(v => (
              <Picker.Item label={`${v}`} value={v} />
            ))}
          </Picker>
        </View>
      )}
    </>
  );
});

const WeightPicker = forwardRef(({ title }: { title: string }, ref) => {
  const [int, onChangeInt] = useState(50);
  const [float, onChangeFloat] = useState(0);
  const [show, onShowPicker] = useState(false);
  useImperativeHandle(ref, () => ({ value: parseFloat(`${int}.${float}`) }));
  return (
    <>
      <Field onShowPicker={() => onShowPicker(!show)} title={title} value={`${int}.${float} kg`} />
      {show && (
        <View style={{ flexDirection: "row", marginHorizontal: 16 }}>
          <Picker
            style={{ width: "50%" }}
            selectedValue={int}
            onValueChange={itemValue => onChangeInt(itemValue)}
          >
            {range(30, 400).map(v => (
              <Picker.Item label={`${v}`} value={v} />
            ))}
          </Picker>
          <Picker
            style={{ width: "50%" }}
            selectedValue={float}
            onValueChange={itemValue => onChangeFloat(itemValue)}
          >
            {range(0, 10).map(v => (
              <Picker.Item label={`.${v}`} value={v} />
            ))}
          </Picker>
        </View>
      )}
    </>
  );
});

const ProfileScreen = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const [gender, onChangeGender] = useState(1);
  const heightRef = useRef(null);
  const birthdayRef = useRef(null);
  const weightRef = useRef(null);
  const goalRef = useRef(null);
  return (
    <>
      <ShapeHeader
        leftComponent={<HeaderBack />}
        title={t("Profile")}
        rightComponent={(
          <HeaderNext
            onNext={() =>
              NavigationService.navigate("CompleteScreen", {
                ...navigation.state.params,
                height: get(heightRef, "current.value", 0),
                weight: get(weightRef, "current.value", 0),
                goal: get(goalRef, "current.value", 0),
                birthday: get(birthdayRef, "current.value", new Date())
              })}
          />
        )}
      />
      <View style={[styles.container]}>
        <Text style={styles.title}>{t("gender")}</Text>
        <View style={[{ flexDirection: "row", marginBottom: 40, marginHorizontal: 16 }]}>
          <ToggleButton
            title={t("male")}
            style={{ flex: 1, marginRight: 4 }}
            on={gender === ActiveLevel.NotVeryActive}
            onPress={() => onChangeGender(ActiveLevel.NotVeryActive)}
          />
          <ToggleButton
            title={t("female")}
            style={{ flex: 1, marginLeft: 4 }}
            on={gender === ActiveLevel.LightlyActive}
            onPress={() => onChangeGender(ActiveLevel.LightlyActive)}
          />
        </View>
        <BirthdayPicker title={t("birthday")} ref={birthdayRef} />
        <HeightPicker title={t("height")} ref={heightRef} />
        <WeightPicker title={t("weight")} ref={weightRef} />
        <WeightPicker title={t("goal")} ref={goalRef} />
      </View>
    </>
  );
};

export default connect()(ProfileScreen);
