import React from "react";
import { Header, HeaderProps } from "react-native-elements";
import firebase from "react-native-firebase";
import { View, Platform } from "react-native";
import Config from "../config";

const { Banner } = firebase.admob;
const { AdRequest } = firebase.admob;
const request = new AdRequest();
request.addKeyword("foobar");

const unitId =
  Platform.OS === "ios"
    ? "ca-app-pub-6824393090470417/3208088823"
    : "ca-app-pub-6824393090470417/3822811275";

interface ShapeHeaderProps {
  displayHeader?: boolean;
}

type Props = HeaderProps & ShapeHeaderProps;

const ShapeHeader = (props: Props) => {
  const {
    leftComponent,
    centerComponent,
    containerStyle,
    rightComponent,
    displayHeader = true
  } = props;
  return (
    <>
      {displayHeader && (
        <>
          <Header
            leftComponent={leftComponent}
            centerComponent={centerComponent}
            containerStyle={containerStyle}
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

export default ShapeHeader;
