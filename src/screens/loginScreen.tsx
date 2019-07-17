import { Formik, FormikActions, FormikProps } from "formik";
import React from "react";
import { Alert, Dimensions, Image, NativeModules, PixelRatio, Text, View } from "react-native";

import store from "../store";

// import Config from "react-native-config";
import DeviceInfo from "react-native-device-info";
import { Header, Icon, Input } from "react-native-elements";
import { AccessToken, LoginManager } from "react-native-fbsdk";
import firebase from "react-native-firebase";
import { TouchableOpacity } from "react-native-gesture-handler";
import { GoogleSignin, GoogleSigninButton, statusCodes } from "react-native-google-signin";
import { connect } from "react-redux";
import { firestoreConnect, withFirestore } from "react-redux-firebase";
import { compose, lifecycle, withHandlers, withReducer, withStateHandlers } from "recompose";
import * as Yup from "yup";
import { AppTitle } from "../components/common";
import { THEME_COLOR } from "../constants";
const hasNotch = DeviceInfo.hasNotch();
const { height, width } = Dimensions.get("window");

GoogleSignin.configure({
  offlineAccess: false,
  webClientId: "1068703927331-2ee061qtm4a8v7227j1vh4ad19kh05fh.apps.googleusercontent.com"
});

interface IFormValues {
  email: string;
}
const Button = ({ title, color = "white", backgroundColor = THEME_COLOR, borderColor = "transparent", style, onPress, iconComp, disabled }) => (
  <View style={{ marginVertical: 8, ...style }}>
    <TouchableOpacity
      style={{
        height: 44,
        borderRadius: 5,
        backgroundColor,
        justifyContent: "center",
        borderColor,
        borderWidth: 1
      }}
      disabled={disabled}
      onPress={onPress}
    >
      <View style={{ position: "absolute", left: "16%" }}>{iconComp}</View>
      <Text style={{ textAlign: "center", color }}>{title}</Text>
    </TouchableOpacity>
  </View>
);

const BoardButton = props => <Button {...props} color={THEME_COLOR} backgroundColor="white" borderColor={THEME_COLOR} />;

const SignupSchema = Yup.object().shape({
  email: Yup.string()
    .email("正しいEメールを入力してください。")
    .required("Eメールを入力してください。")
});

const renderForm = ({ values, handleSubmit, setFieldValue, touched, errors, setFieldTouched, isSubmitting, setSubmitting }: FormikProps<IFormValues>) => (
  <>
    <Input
      placeholder={"email"}
      keyboardType="email-address"
      autoCapitalize="none"
      autoCorrect={false}
      value={values.email}
      onChangeText={value => setFieldValue("email", value)}
      onBlur={() => setFieldTouched("email")}
      editable={!isSubmitting}
      errorMessage={touched.email && errors.email ? errors.email : undefined}
    />

    <Button
      title={"新規作成 or ログイン"}
      style={{}}
      disabled={isSubmitting}
      onPress={() => {
        handleSubmit();
        setSubmitting(false);
      }}
    />
  </>
);

class LoginScreen extends React.Component {
  public async componentDidMount() {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
    firebase.auth().onAuthStateChanged(user => {
      this.props.navigation.navigate(user ? "App" : "Auth");
    });
    this.props.dispatch({ type: "INCREMENT" });
    // store.dispatch({ type: "INCREMENT" });
  }

  public googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const data = await GoogleSignin.signIn();
      const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken);
      await firebase.auth().signInWithCredential(credential);
    } catch (error) {
      console.log(error);
    }
  };

  public facebookLogin = async () => {
    try {
      const result = await LoginManager.logInWithReadPermissions(["public_profile", "email"]);
      if (result.isCancelled) {
        throw new Error("User cancelled request");
      }

      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        throw new Error("Something went wrong obtaining the users access token");
      }
      const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
      await firebase.auth().signInWithCredential(credential);
    } catch (e) {
      if (e.code === "auth/account-exists-with-different-credential") {
        Alert.alert("確認", "別の認証方法で登録されています。他の認証方法でログインして下さい。", [
          {
            text: "OK"
          }
        ]);
      }
    }
  };

  public signInWithEmailAndPassword = async values => {
    this.props.dispatch({ type: "INCREMENT", email: values.email });

    const actionCodeSettings = {
      url: "https://healther-24332.firebaseapp.com",
      handleCodeInApp: true, // must always be true for sendSignInLinkToEmail
      iOS: {
        bundleId: "com.yukimatsushita.shape"
      },
      android: {
        packageName: "com.yukimatsushita.shape",
        installApp: true,
        minimumVersion: "12"
      },
      dynamicLinkDomain: "yukimatsushita.page.link"
    };

    try {
      await firebase.auth().sendSignInLinkToEmail(values.email, actionCodeSettings);
      Alert.alert("確認", "認証メールを送信しました。メールをご確認下さい。", [
        {
          text: "OK"
        }
      ]);
    } catch (err) {
      console.warn(err);
    }
  };

  public render() {
    return (
      <View style={{ flex: 1 }}>
        <Header
          leftComponent={
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center"
              }}
              onPress={() => {
                this.props.navigation.goBack();
              }}
            >
              <View style={{ top: -3, marginRight: 8 }}>
                <Icon type="font-awesome" size={40} color={THEME_COLOR} name="angle-left" />
              </View>
              <Text style={{ fontSize: 18, color: THEME_COLOR }}>戻る</Text>
            </TouchableOpacity>
          }
          centerComponent={<Text style={{ fontSize: 18, color: "black" }}>新規作成 or ログイン</Text>}
          containerStyle={{
            backgroundColor: "white"
          }}
        />
        <View style={{ flex: 1, marginHorizontal: 16 }}>
          <View style={{ flex: 1 }} />
          <Formik initialValues={{ email: "" }} onSubmit={this.signInWithEmailAndPassword} validationSchema={SignupSchema} render={(formikBag: FormikProps<IFormValues>) => renderForm(formikBag)} />
          <View
            style={{
              flexDirection: "row",
              marginVertical: 24
            }}
          >
            <View
              style={{
                flex: 1,
                borderBottomWidth: 1,
                marginBottom: 8,
                borderColor: "rgba(0, 0, 0, 0.3)"
              }}
            />
            <Text style={{ marginHorizontal: 8, color: "rgba(0, 0, 0, 0.3)" }}>OR</Text>
            <View
              style={{
                flex: 1,
                borderBottomWidth: 1,
                marginBottom: 8,
                borderColor: "rgba(0, 0, 0, 0.3)"
              }}
            />
          </View>
          <Button
            title={"Googleで続ける"}
            backgroundColor="white"
            color="#757575"
            borderColor="#E0E0E0"
            onPress={this.googleSignIn}
            iconComp={<Image source={require("../../images/logoGoogle.png")} />}
          />
          <Button title={"Facebookで続ける"} backgroundColor="#3B5998" onPress={this.facebookLogin} iconComp={<Icon type="font-awesome" color={"white"} name="facebook" />} />
          <View style={{ flex: 1 }} />
        </View>
      </View>
    );
  }
}

const enhance = compose(
  withFirestore,
  connect((state, ownProps) => ({
    login: state.login
  }))
);

export default enhance(LoginScreen);
