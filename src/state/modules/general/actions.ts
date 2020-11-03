import { action } from "typesafe-actions";
import GeneralActionTypes, { General } from "./types";

export const fetchGeneral = () => action(GeneralActionTypes.GENERAL_FETCH);

export const fetchGeneralSuccess = (result: General) =>
  action(GeneralActionTypes.GENERAL_FETCH_SUCCESS, result);
