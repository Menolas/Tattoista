import { bookingsApi } from "./bookingsApi";
import { ResultCodesEnum } from "../../utils/constants";
import {AddConsultationFormValues, BookedConsultationType, SearchFilterType} from "../../types/Types";
import { AppStateType } from "../redux-store";
import { ThunkAction } from "redux-thunk";
import type {} from "redux-thunk/extend-redux";
import {getNewPage} from "../../utils/functions";

const SET_PAGE_SIZE = 'SET_BOOKINGS_PAGE_SIZE';
const SET_FILTER = 'SET_BOOKINGS_FILTER';
const SET_STATUS = 'SET_BOOKINGS_STATUS';
const SET_BOOKINGS = 'SET_BOOKINGS';
const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE_FOR_BOOKINGS';
const SET_TOTAL = 'SET_TOTAL_BOOKINGS_COUNT';
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING';
const TOGGLE_IS_STATUS_CHANGING_IN_PROGRESS = 'TOGGLE_IS_STATUS_CHANGING_IN_PROGRESS';
const TOGGLE_IS_DELETING_IN_PROCESS = 'TOGGLE_IS_DELETING_IN_PROCESS';
const DELETE_BOOKING = 'DELETE_BOOKING';
const ADD_BOOKING = 'ADD_BOOKING';
const SET_SUCCESS_MODAL = 'SET_SUCCESS_MODAL';
const SET_API_ERROR = 'SET_API_ERROR';
const SET_ACCESS_ERROR = 'SET_ACCESS_ERROR';
const BOOKING_SUCCESS = "Congratulation! You've just created a consultation request.";
const BOOKING_INTO_CLIENT_SUCCESS = "Congratulation! You've just created a client from a consultation request.";

let initialState = {
  bookings: [] as Array<BookedConsultationType>,
  total: 0 as number,
  pageSize: 5 as number,
  currentPage: 1 as number,
  isFetching: false,
  isStatusChanging: [] as Array<string>,
  isDeletingInProcess: [] as Array<string>,
  filter: {
    term: '' as string | null,
    condition: 'any' as string | null
  } as SearchFilterType,
  apiError: '' as string,
  accessError: '' as string | undefined,
  successModal: {
    isSuccess: false as boolean,
    successText: '' as string,
  },
}

export type SuccessModalType = typeof initialState.successModal;
export type InitialStateType = typeof initialState;

export const bookingsReducer = (
    state = initialState,
    action: ActionsTypes
): InitialStateType => {

  switch (action.type) {
    case SET_PAGE_SIZE:
      return {
        ...state,
        pageSize: action.pageSize,
        currentPage: 1
      }

    case SET_FILTER:
      return {
        ...state,
        filter: action.filter
      }

    case SET_BOOKINGS:
      return {
        ...state,
        bookings: action.bookings,
      }

    case SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.page,
      }

    case SET_TOTAL:
      return {
        ...state,
        total: action.count,
      }

    case SET_STATUS:
      return {
        ...state,
        bookings: state.bookings.map(booking => {
          if (booking._id === action.id) {
            return { ...booking, status: action.status }
          }
          return booking
        })
      }
    case TOGGLE_IS_FETCHING:
      return {
        ...state,
        isFetching: action.isFetching,
      }
    case TOGGLE_IS_STATUS_CHANGING_IN_PROGRESS:
      return {
        ...state,
        isStatusChanging: action.isFetching
          ? [...state.isStatusChanging, action.id]
          : state.isStatusChanging.filter(id => id !== action.id)
      }
    case TOGGLE_IS_DELETING_IN_PROCESS:
      return {
        ...state,
        isDeletingInProcess: action.isFetching
          ? [...state.isDeletingInProcess, action.id]
          : state.isDeletingInProcess.filter(id => id !== action.id)
      }

    case DELETE_BOOKING:
      return {
        ...state,
        bookings: state.bookings.filter(booking => booking._id !== action.id),
        total: state.total - 1
      }

    case ADD_BOOKING:
      return {
        ...state,
        bookings: [{...action.consultation}, ...state.bookings]
      }

    case SET_SUCCESS_MODAL:
      return {
        ...state,
        successModal: {
          isSuccess: action.isSuccess,
          successText: action.text
        }
      }

    case SET_API_ERROR:
      return {
        ...state,
        apiError: action.error
      }

    case SET_ACCESS_ERROR:
      return {
        ...state,
        accessError: action.error
      }

    default: return state
  }
}

type ActionsTypes = SetApiErrorAT | SetSuccessModalAT | SetBookedConsultationsPageSizeAT |
     SetBookedConsultationsFilterAT | SetBookedConsultationsAT | SetCurrentPageForBookedConsultationsAT |
    SetBookedConsultationsTotalCountAT | ChangeBookedConsultationStatusAT | SetIsFetchingAT |
    ToggleIsStatusChangingAT | ToggleIsDeletingInProcessAT | DeleteBookedConsultationAT |
    AddBookedConsultationAT | SetAccessErrorAT;

// actions creators

type SetSuccessModalAT = {
  type: typeof SET_SUCCESS_MODAL
  isSuccess: boolean
  text: string
}

export const setSuccessModalAC = (isSuccess: boolean, text: string): SetSuccessModalAT => ({
  type: SET_SUCCESS_MODAL, isSuccess, text
});

type SetAccessErrorAT = {
  type: typeof SET_ACCESS_ERROR
  error: string | undefined
}

export const setAccessErrorAC = (error: string | undefined): SetAccessErrorAT => ({
  type: SET_ACCESS_ERROR, error
});

type SetApiErrorAT = {
  type: typeof SET_API_ERROR
  error: string
}

export const setApiErrorAC = (error: string): SetApiErrorAT => ({
  type: SET_API_ERROR, error
});

type SetBookedConsultationsPageSizeAT = {
  type: typeof  SET_PAGE_SIZE
  pageSize: number
}

export const setBookedConsultationsPageSizeAC = (pageSize: number): SetBookedConsultationsPageSizeAT => ({
    type: SET_PAGE_SIZE, pageSize
});

type SetBookedConsultationsFilterAT = {
  type: typeof  SET_FILTER
  filter: SearchFilterType
}

export const setBookedConsultationsFilterAC = (filter: SearchFilterType): SetBookedConsultationsFilterAT => ({
    type: SET_FILTER, filter
  });

type SetBookedConsultationsAT = {
  type: typeof SET_BOOKINGS,
  bookings: Array<BookedConsultationType>
}

const setBookedConsultationsAC = (bookings: Array<BookedConsultationType>): SetBookedConsultationsAT => ({
      type: SET_BOOKINGS, bookings
});

type SetCurrentPageForBookedConsultationsAT = {
  type: typeof SET_CURRENT_PAGE,
  page: number
}

export const setCurrentPageForBookedConsultationsAC = (page: number): SetCurrentPageForBookedConsultationsAT => ({
      type: SET_CURRENT_PAGE, page
});

type SetBookedConsultationsTotalCountAT = {
  type: typeof SET_TOTAL,
  count: number
}

const setBookedConsultationsTotalCountAC = (count: number): SetBookedConsultationsTotalCountAT => ({
      type: SET_TOTAL, count
    });

type ChangeBookedConsultationStatusAT = {
  type: typeof SET_STATUS,
  id: string,
  status: boolean
}

const changeBookedConsultationStatusAC = (id: string, status: boolean): ChangeBookedConsultationStatusAT => ({
    type: SET_STATUS, id, status
  });

type SetIsFetchingAT = {
  type: typeof TOGGLE_IS_FETCHING,
  isFetching: boolean
}

const setIsFetchingAC = (isFetching: boolean): SetIsFetchingAT => ({
    type: TOGGLE_IS_FETCHING, isFetching
  });

type ToggleIsStatusChangingAT = {
  type: typeof TOGGLE_IS_STATUS_CHANGING_IN_PROGRESS,
  isFetching: boolean,
  id: string
}

const toggleIsStatusChangingAC = (isFetching: boolean, id: string): ToggleIsStatusChangingAT => ({
    type: TOGGLE_IS_STATUS_CHANGING_IN_PROGRESS, isFetching, id
  });

type ToggleIsDeletingInProcessAT = {
  type: typeof TOGGLE_IS_DELETING_IN_PROCESS,
  isFetching: boolean,
  id: string
}

const toggleIsDeletingInProcessAC = (isFetching: boolean, id: string): ToggleIsDeletingInProcessAT => ({
    type: TOGGLE_IS_DELETING_IN_PROCESS, isFetching, id
  });

type DeleteBookedConsultationAT = {
  type: typeof DELETE_BOOKING,
  id: string
}

const deleteBookedConsultationAC = (id: string): DeleteBookedConsultationAT => ({
    type: DELETE_BOOKING, id
});

type AddBookedConsultationAT = {
  type: typeof ADD_BOOKING,
  consultation: BookedConsultationType
}

const addBookedConsultationAC = (consultation: BookedConsultationType): AddBookedConsultationAT => ({
    type: ADD_BOOKING, consultation
});

// thunks

type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

const deleteBookingThunk = (
    token: string | null,
    id: string,
    bookings: Array<BookedConsultationType>,
    currentPage: number,
    total: number,
    pageLimit: number,
    filter: SearchFilterType
): ThunkType => async (dispatch) => {
  if (bookings.length > 1) {
    dispatch(deleteBookedConsultationAC(id));
    dispatch(setBookedConsultationsTotalCountAC(total - 1));
  } else {
    const newPage = getNewPage(currentPage);
    if (currentPage === newPage) {
      await dispatch(getBookedConsultations(token, newPage, pageLimit, filter));
    }
    dispatch(deleteBookedConsultationAC(id));
    dispatch(setCurrentPageForBookedConsultationsAC(newPage));
  }
}

export const getBookedConsultations = (
  token: string | null,
  currentPage: number,
  pageSize: number,
  filter: SearchFilterType
): ThunkType => async (
    dispatch,
    getState
) => {
  try {
    dispatch(setIsFetchingAC(true));
    let response = await bookingsApi.getBookedConsultations(
      token,
      currentPage,
      pageSize,
      filter
    );
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setAccessErrorAC(''));
      dispatch(setBookedConsultationsAC(response.bookings));
      dispatch(setBookedConsultationsTotalCountAC(response.totalCount));
    }
  } catch (e) {
    // @ts-ignore
    dispatch(setAccessErrorAC(e.response.data.message));
    console.log(e);
  } finally {
    dispatch(setIsFetchingAC(false));
  }
}

export const changeBookedConsultationStatus = (
  id: string,
  status: boolean
): ThunkType => async (dispatch) => {

  try {
    dispatch(toggleIsStatusChangingAC(true, id));
    let response = await bookingsApi.changeConsultationStatus(id, status);
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(changeBookedConsultationStatusAC(id, response.status));
    }
  } catch (e) {
    console.log(e);
  } finally {
    dispatch(toggleIsStatusChangingAC(false, id));
  }
}

export const deleteBookedConsultation = (
    token: string | null,
    id: string,
    bookings: Array<BookedConsultationType>,
    currentPage: number,
    total: number,
    pageLimit: number,
    filter: SearchFilterType
): ThunkType => async (dispatch) => {
  try {
    dispatch(toggleIsDeletingInProcessAC(true, id));
    let response = await bookingsApi.deleteConsultation(id);
    if (response.resultCode === ResultCodesEnum.Success) {
      await dispatch(deleteBookingThunk(token, id, bookings, currentPage, total, pageLimit, filter));
    }
  } catch (e) {
    console.log(e);
  } finally {
    dispatch(toggleIsDeletingInProcessAC(false, id));
  }
}

export const addBookedConsultation = (
  values: AddConsultationFormValues,
  total: number
): ThunkType => async (dispatch) => {
  try {
    let response = await bookingsApi.addConsultation(values);
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(addBookedConsultationAC(response.booking));
      dispatch(setBookedConsultationsTotalCountAC(total + 1));
      dispatch(setSuccessModalAC(true, BOOKING_SUCCESS));
    }
  } catch (e: any) {
    dispatch(setApiErrorAC(e.response.data.message));
  }
}

export const turnConsultationToClient = (
    token: string | null,
    id: string,
    fullName: string,
    contacts: {},
    bookings: Array<BookedConsultationType>,
    currentPage: number,
    total: number,
    pageLimit: number,
    filter: SearchFilterType
): ThunkType => async (dispatch) => {
  try {
    dispatch(toggleIsDeletingInProcessAC(true, id));
    let response = await bookingsApi.turnConsultationToClient(
      id,
      fullName,
      contacts
    )
    if (response.resultCode === ResultCodesEnum.Success) {
      await dispatch(deleteBookingThunk(token, id, bookings, currentPage, total, pageLimit, filter));
      dispatch(setSuccessModalAC(true, BOOKING_INTO_CLIENT_SUCCESS));
    }
  } catch (e: any) {
    dispatch(setApiErrorAC(e.response.data.message));
  } finally {
    dispatch(toggleIsDeletingInProcessAC(false, id));
  }
}

export const archiveConsultation = (
    token: string | null,
    id: string,
    bookings: Array<BookedConsultationType>,
    currentPage: number,
    total: number,
    pageLimit: number,
    filter: SearchFilterType
): ThunkType => async (dispatch) => {
  try {
    dispatch(toggleIsDeletingInProcessAC(true, id));
    let response = await bookingsApi.archiveConsultation(id);
    if (response.resultCode === ResultCodesEnum.Success) {
      await dispatch(deleteBookingThunk(token, id, bookings, currentPage, total, pageLimit, filter));
    }
  } catch (e) {
    console.log(e);
  } finally {
    dispatch(toggleIsDeletingInProcessAC(false, id));
  }
}
