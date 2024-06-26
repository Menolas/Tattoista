import {aboutApi, GetPagesResponseType} from "./aboutApi";
import {PageType} from "../../types/Types";
import { ThunkAction } from "redux-thunk";
import { AppStateType } from "../redux-store";
import { ResultCodesEnum } from "../../utils/constants";
import { pages } from "../../data/PagesData";
import {
  setSuccessModalAC,
  SetSuccessModalAT,
  setApiErrorAC,
  SetApiErrorAT} from "../General/general-reducer";

const SET_ABOUT_PAGE = 'SET_ABOUT_PAGE';
const SET_FAKE_API = 'SET_FAKE_API';
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING';
const TOGGLE_IS_EDITING = 'TOGGLE_IS_EDITING';

const ABOUT_PAGE_SUCCESS = "You successfully updated your 'about' block";


let initialState = {
  page: {} as PageType,
  isFetching: false as boolean,
  isEditing: false as boolean,
  fakeApi: false as boolean,
}

export type InitialStateType = typeof initialState;

export const aboutReducer = (
    state = initialState,
    action: ActionsTypes
): InitialStateType => {
  //debugger

  switch (action.type) {
    case TOGGLE_IS_FETCHING:
      return {
        ...state,
        isFetching: action.isFetching,
      }

    case TOGGLE_IS_EDITING:
      return {
        ...state,
        isEditing: action.isEditing,
      }

    case SET_ABOUT_PAGE:
      return {
        ...state,
        page: action.page
      }

    case SET_FAKE_API:
      return {
        ...state,
        fakeApi: action.fakeApi,
      }

    default: return {
      ...state
    }
  }
}

type ActionsTypes = SetAboutPageAT | SetSuccessModalAT | SetApiErrorAT
    | SetFakeApiAT | SetIsFetchingAT | SetIsEditingAT;

// action creators

type SetIsFetchingAT = {
  type: typeof TOGGLE_IS_FETCHING,
  isFetching: boolean
}

const setIsFetchingAC = (isFetching: boolean): SetIsFetchingAT => ({
  type: TOGGLE_IS_FETCHING, isFetching
});

type SetIsEditingAT = {
  type: typeof TOGGLE_IS_EDITING,
  isEditing: boolean
}

const setIsEditingAC = (isEditing: boolean): SetIsEditingAT => ({
  type: TOGGLE_IS_EDITING, isEditing
});

type SetFakeApiAT = {
  type: typeof SET_FAKE_API
  fakeApi: boolean
}

const setFakeApiAC = (fakeApi: boolean): SetFakeApiAT => ({
  type: SET_FAKE_API, fakeApi
});

type SetAboutPageAT = {
  type: typeof SET_ABOUT_PAGE,
  page: PageType
};

const setAboutPageAC = (page: PageType): SetAboutPageAT => ({
      type: SET_ABOUT_PAGE, page
});

// thunks

type ThunkType = ThunkAction<Promise<GetPagesResponseType | null> | Promise<void>, AppStateType, unknown, ActionsTypes>

export const getAboutPage = (): ThunkType => async (dispatch) => {
  try {
    dispatch(setIsFetchingAC(true));
    const response = await aboutApi.getAboutPage();
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setFakeApiAC(false));
      dispatch(setAboutPageAC(response.page));
    }
  } catch (e) {
    console.log(e);
    dispatch(setFakeApiAC(true));
    dispatch(setAboutPageAC(pages));
  } finally {
    dispatch(setIsFetchingAC(false));
  }
}

export const editAboutPage = (
  FormData: FormData
): ThunkType => async (dispatch) => {
  let apiResponse = null;
  try {
    dispatch(setIsEditingAC(true));
    dispatch(setIsFetchingAC(true));
    let response = await aboutApi.editAboutPage(FormData);
    apiResponse = response;
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setApiErrorAC(null));
      dispatch(setAboutPageAC(response.page));
      dispatch(setSuccessModalAC(true, ABOUT_PAGE_SUCCESS));
    }
  } catch (e: any) {
    dispatch(setApiErrorAC(e.response?.data?.message || 'An error occurred'));
    console.log(e);
  } finally {
    dispatch(setIsFetchingAC(false));
    dispatch(setIsEditingAC(false));
  }
  return apiResponse; // Return the response
}

export const changeAboutPageVisibility = (
    isActive: boolean
): ThunkType => async (dispatch) => {
  try {
    const response = await aboutApi.changeAboutPageVisibility(isActive);
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setAboutPageAC(response.page));
    }
  } catch (e) {
    console.log(e);
  }
}
