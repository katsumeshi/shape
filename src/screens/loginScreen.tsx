import { Formik, FormikProps } from "formik";
import React, { useEffect } from "react";
import {
  Alert,
  Image,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { Icon, Input } from "react-native-elements";
import { AccessToken, LoginManager } from "react-native-fbsdk";
import firebase from "react-native-firebase";
import { GoogleSignin } from "react-native-google-signin";
import { connect } from "react-redux";
import * as Yup from "yup";
import { NavigationScreenProp, NavigationState } from "react-navigation";
import { useTranslation } from "react-i18next";
import i18next, { TFunction } from "i18next";
import { Button } from "../components/common";
import Config from "../config";
import { THEME_COLOR } from "../constants";

import { signInWithEmailAndPassword } from "../services/firebase";
import { AuthState, AuthModel } from "../state/modules/auth/types";
import ShapeHeader from "../components/header";

const styles = StyleSheet.create({
  button: {
    marginBottom: 16
  },
  input: {
    marginBottom: 16
  },
  separatorContainer: {
    flexDirection: "row",
    marginVertical: 24
  },
  separatorLine: {
    flex: 1,
    borderBottomWidth: 1,
    marginBottom: 8,
    borderColor: "rgba(0, 0, 0, 0.3)"
  },
  separatorText: { marginHorizontal: 8, color: "rgba(0, 0, 0, 0.3)" },
  headerLeft: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  headerLeftIcon: { top: -3, marginRight: 8 },
  headerLeftText: { fontSize: 18, color: THEME_COLOR },
  headerTitle: { fontSize: 18, color: "black" }
});

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
}

GoogleSignin.configure({
  offlineAccess: false,
  webClientId: Config.WEB_API_KEY,
  iosClientId: Config.IOS_API_KEY
});

interface FormValues {
  email: string;
}
const SignupSchema = (t: TFunction) => {
  return Yup.object().shape({
    email: Yup.string()
      .email(t("enterValidEmail"))
      .required(t("enterEmail"))
  });
};

const renderForm = (
  {
    values,
    handleSubmit,
    setFieldValue,
    touched,
    errors,
    setFieldTouched,
    isSubmitting,
    setSubmitting
  }: FormikProps<FormValues>,
  t: TFunction
) => {
  return (
    <>
      <Input
        placeholder="email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={values.email}
        containerStyle={styles.input}
        onChangeText={value => setFieldValue("email", value)}
        onBlur={() => setFieldTouched("email")}
        editable={!isSubmitting}
        errorMessage={touched.email && errors.email ? errors.email : undefined}
      />

      <Button
        title={t("signupOrLogin")}
        disabled={isSubmitting}
        onPress={() => {
          handleSubmit();
          setSubmitting(false);
        }}
      />
    </>
  );
};

const EmailField = () => {
  const { t } = useTranslation();
  return (
    <Formik
      initialValues={{ email: "" }}
      onSubmit={async props => {
        await signInWithEmailAndPassword(props);
        Alert.alert(t("confirmation"), t("sentAuthEmail"), [
          {
            text: t("ok")
          }
        ]);
      }}
      validationSchema={() => SignupSchema(t)}
      render={(formikBag: FormikProps<FormValues>) => renderForm(formikBag, t)}
    />
  );
};

const facebookLogin = async (t: TFunction) => {
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
      Alert.alert(t("confirmation"), t("authError"), [
        {
          text: t("ok")
        }
      ]);
    }
  }
};

const googleSignIn = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const { idToken } = await GoogleSignin.signIn();
    const credential = firebase.auth.GoogleAuthProvider.credential(idToken);
    await firebase.auth().signInWithCredential(credential);
  } catch (error) {
    console.warn(error);
  }
};

const Separator = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.separatorContainer}>
      <View style={styles.separatorLine} />
      <Text style={styles.separatorText}>{t("or")}</Text>
      <View style={styles.separatorLine} />
    </View>
  );
};

const GoogleLoginButton = () => {
  const { t } = useTranslation();
  return (
    <Button
      title={t("continueWithGoogle")}
      backgroundColor="white"
      color="#757575"
      borderColor="#E0E0E0"
      onPress={googleSignIn}
      style={styles.button}
      iconComp={
        <Image source={require("../../resources/images/logoGoogle.png")} />
      }
    />
  );
};

const FacebookLoginButton = () => {
  const { t } = useTranslation();
  return (
    <Button
      title={t("continueWithFB")}
      backgroundColor="#3B5998"
      onPress={() => facebookLogin(t)}
      iconComp={<Icon type="font-awesome" color="white" name="facebook" />}
    />
  );
};

const LoginScreenHeader = ({
  navigation
}: {
  navigation: NavigationScreenProp<NavigationState>;
}) => {
  const { t } = useTranslation();
  return (
    <>
      <ShapeHeader
        leftComponent={
          <TouchableOpacity
            style={styles.headerLeft}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <View style={styles.headerLeftIcon}>
              <Icon
                type="font-awesome"
                size={40}
                color={THEME_COLOR}
                name="angle-left"
              />
            </View>
            <Text style={styles.headerLeftText}>{t("back")}</Text>
          </TouchableOpacity>
        }
        centerComponent={
          <Text style={styles.headerTitle}>{t("signupOrLogin")}</Text>
        }
        containerStyle={{
          backgroundColor: "white"
        }}
      />
    </>
  );
};

const LoginScreen = ({
  navigation,
  auth
}: {
  navigation: NavigationScreenProp<NavigationState>;
  auth: AuthModel;
}) => {
  return (
    <View style={{ flex: 1 }}>
      <LoginScreenHeader navigation={navigation} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1, marginHorizontal: 16 }}
      >
        <View style={{ flex: 1 }} />
        <EmailField />
        <Separator />
        <GoogleLoginButton />
        <FacebookLoginButton />
        <View style={{ flex: 1 }} />
      </KeyboardAvoidingView>
    </View>
  );
};

export default connect(({ auth }: { auth: AuthState }) => ({
  auth: auth.data
}))(LoginScreen);
