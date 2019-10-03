import { Formik, FormikProps } from "formik";
import React, { useEffect } from "react";
import { Alert, Image, Text, View, TouchableOpacity } from "react-native";
import { Header, Icon, Input } from "react-native-elements";
import { AccessToken, LoginManager } from "react-native-fbsdk";
import firebase from "react-native-firebase";
import { GoogleSignin } from "react-native-google-signin";
import { connect } from "react-redux";
import * as Yup from "yup";
import { Button } from "../components/common";
import Config from "../../config";
import { THEME_COLOR } from "../constants";

import { signInWithEmailAndPassword } from "../services/firebase";

import { Navigation } from "../types";

interface Props {
  navigation: Navigation;
}

GoogleSignin.configure({
  offlineAccess: false,
  webClientId: Config.WEB_API_KEY,
  iosClientId: Config.IOS_API_KEY
});

interface FormValues {
  email: string;
}
const SignupSchema = Yup.object().shape({
  email: Yup.string()
    .email("正しいEメールを入力してください。")
    .required("Eメールを入力してください。")
});

const EmailField = () => (
  <Formik
    initialValues={{ email: "" }}
    onSubmit={async props => {
      await signInWithEmailAndPassword(props);
      Alert.alert("確認", "認証メールを送信しました。メールをご確認下さい。", [
        {
          text: "OK"
        }
      ]);
    }}
    validationSchema={SignupSchema}
    render={(formikBag: FormikProps<FormValues>) => renderForm(formikBag)}
  />
);

const renderForm = ({
  values,
  handleSubmit,
  setFieldValue,
  touched,
  errors,
  setFieldTouched,
  isSubmitting,
  setSubmitting
}: FormikProps<FormValues>) => (
  <>
    <Input
      placeholder="email"
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
      title="新規作成 or ログイン"
      disabled={isSubmitting}
      onPress={() => {
        handleSubmit();
        setSubmitting(false);
      }}
    />
  </>
);

const facebookLogin = async () => {
  try {
    const result = await LoginManager.logInWithPermissions([
      "public_profile",
      "email"
    ]);

    if (result.isCancelled) {
      throw new Error("User cancelled request");
    }

    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw new Error("Something went wrong obtaining the users access token");
    }
    const credential = firebase.auth.FacebookAuthProvider.credential(
      data.accessToken
    );
    await firebase.auth().signInWithCredential(credential);
  } catch (e) {
    if (e.code === "auth/account-exists-with-different-credential") {
      Alert.alert(
        "確認",
        "別の認証方法で登録されています。他の認証方法でログインして下さい。",
        [
          {
            text: "OK"
          }
        ]
      );
    }
  }
};

const googleSignIn = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const data = await GoogleSignin.signIn();
    const credential = firebase.auth.GoogleAuthProvider.credential(
      data.idToken,
      data.accessToken
    );
    await firebase.auth().signInWithCredential(credential);
  } catch (error) {
    console.warn(error);
  }
};

const Separator = () => (
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
);

const GoogleLoginButton = () => (
  <Button
    title="Googleで続ける"
    backgroundColor="white"
    color="#757575"
    borderColor="#E0E0E0"
    onPress={googleSignIn}
    iconComp={<Image source={require("../../images/logoGoogle.png")} />}
  />
);

const FacebookLoginButton = () => (
  <Button
    title="Facebookで続ける"
    backgroundColor="#3B5998"
    onPress={facebookLogin}
    iconComp={<Icon type="font-awesome" color="white" name="facebook" />}
  />
);

const LoginScreenHeader = (props: Props) => (
  <Header
    leftComponent={
      <TouchableOpacity
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center"
        }}
        onPress={() => {
          props.navigation.goBack();
        }}
      >
        <View style={{ top: -3, marginRight: 8 }}>
          <Icon
            type="font-awesome"
            size={40}
            color={THEME_COLOR}
            name="angle-left"
          />
        </View>
        <Text style={{ fontSize: 18, color: THEME_COLOR }}>戻る</Text>
      </TouchableOpacity>
    }
    centerComponent={
      <Text style={{ fontSize: 18, color: "black" }}>新規作成 or ログイン</Text>
    }
    containerStyle={{
      backgroundColor: "white"
    }}
  />
);

const LoginScreen = (props: Props) => {
  useEffect(() => {
    props.navigation.navigate(props.auth.isLoggedIn ? "App" : "Auth");
  });
  return (
    <View style={{ flex: 1 }}>
      <LoginScreenHeader {...props} />
      <View style={{ flex: 1, marginHorizontal: 16 }}>
        <View style={{ flex: 1 }} />
        <EmailField />
        <Separator />
        <GoogleLoginButton />
        <FacebookLoginButton />
        <View style={{ flex: 1 }} />
      </View>
    </View>
  );
};

export default connect(state => ({ auth: state.auth }))(LoginScreen);
