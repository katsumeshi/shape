import React from "react";
import { Header, HeaderProps, Icon } from "react-native-elements";
import firebase from "react-native-firebase";
import { View, Platform, TouchableOpacity, StyleSheet, Text } from "react-native";
import { useTranslation } from "react-i18next";
import Config from "../config";
import { THEME_COLOR } from "../constants";
import NavigationService from "../../NavigationService";

const { Banner } = firebase.admob;
const { AdRequest } = firebase.admob;
const request = new AdRequest();
request.addKeyword("foobar");

const styles = StyleSheet.create({
  container: {
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
  headerRightIcon: { top: -3, marginLeft: 8 },
  headerLeftText: { fontSize: 18, color: THEME_COLOR },
  headerTitle: { fontSize: 18, color: "black" }
});

const unitId =
  Platform.OS === "ios"
    ? "ca-app-pub-6824393090470417/3208088823"
    : "ca-app-pub-6824393090470417/3822811275";

interface ShapeHeaderProps {
  displayHeader?: boolean;
  title: string;
}

type Props = HeaderProps & ShapeHeaderProps;

export const ShapeHeader = (props: Props) => {
  const { leftComponent, title, rightComponent, displayHeader = true } = props;
  return (
    <>
      {displayHeader && (
        <>
          <Header
            leftComponent={leftComponent}
            centerComponent={<Text style={styles.headerTitle}>{title}</Text>}
            containerStyle={{
              backgroundColor: "white"
            }}
            rightComponent={rightComponent}
          />
          <View style={{ height: 2, backgroundColor: "lightgrey" }} />
        </>
      )}
      {!Config.DEBUG && (
        <Banner
          unitId={unitId}
          size="SMART_BANNER"
          request={request.build()}
          onAdLoaded={() => {
            console.log("Advert loaded");
          }}
        />
      )}
    </>
  );
};

export const HeaderBack = () => {
  const { t } = useTranslation();
  return (
    <TouchableOpacity
      style={styles.headerLeft}
      onPress={() => {
        NavigationService.goBack();
      }}
    >
      <View style={styles.headerLeftIcon}>
        <Icon type="font-awesome" size={40} color={THEME_COLOR} name="angle-left" />
      </View>
      <Text style={styles.headerLeftText}>{t("back")}</Text>
    </TouchableOpacity>
  );
};

export const HeaderNext = ({ onNext }: { onNext: () => void }) => {
  const { t } = useTranslation();
  return (
    <TouchableOpacity style={styles.headerLeft} onPress={onNext}>
      <Text style={styles.headerLeftText}>{t("next")}</Text>
      <View style={styles.headerRightIcon}>
        <Icon type="font-awesome" size={40} color={THEME_COLOR} name="angle-right" />
      </View>
    </TouchableOpacity>
  );
};
