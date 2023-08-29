import { generalSourcesApi } from './generalSourcesApi'
import {FaqType, PageType, ServiceType} from '../../types/Types'
import {ThunkAction} from 'redux-thunk'
import {AppStateType} from '../redux-store'
import {ResultCodesEnum} from "../../utils/constants";

const SET_FAQ_ITEMS = 'SET_FAQ_ITEMS'
const SET_SERVICES = 'SET_SERVICES'
const SET_PAGES = 'SET_PAGES'
const SET_PAGE_VISIBILITY = 'SET_PAGE_VISIBILITY'

let initialState = {
  faq: [] as Array<FaqType>,
  services: [] as Array<ServiceType>,
  pages: [] as Array<PageType>
}

export type InitialStateType = typeof initialState

export const mainPageReducer = (
    state = initialState,
    action: ActionsTypes
): InitialStateType => {

  switch (action.type) {

    case SET_FAQ_ITEMS:
      return {
        ...state,
        faq: action.faqItems
      }
    case SET_SERVICES:
      return {
        ...state,
        services: action.services
      }

    case SET_PAGES:
      return {
        ...state,
        pages: action.pages
      }

    case SET_PAGE_VISIBILITY:
      return {
        ...state,
        pages: state.pages.map(page => {
          if (page._id === action.pageId) {
            return { ...page, isActive: action.isActive}
          }
          return page
        })
      }

    default: return {
      ...state,
    }
  }
}

type ActionsTypes = SetPageVisibilityActionType | SetPagesActionType | SetFaqItemsActionType | SetServicesActionType

// action creators

type SetPageVisibilityActionType = {
  type: typeof SET_PAGE_VISIBILITY
  pageId: string
  isActive: boolean
}

const setPageVisibility = (pageId: string, isActive: boolean): SetPageVisibilityActionType => ({
  type: SET_PAGE_VISIBILITY, pageId, isActive
})

type SetPagesActionType = {
  type: typeof SET_PAGES,
  pages: Array<PageType>
}

const setPages = (pages: Array<PageType>): SetPagesActionType => (
    {
      type: SET_PAGES, pages
    }
)

type SetFaqItemsActionType = {
  type: typeof SET_FAQ_ITEMS,
  faqItems: Array<FaqType>
}

const setFaqItems = (faqItems: Array<FaqType>): SetFaqItemsActionType => (
  {
    type: SET_FAQ_ITEMS, faqItems
  }
)

type SetServicesActionType = {
  type: typeof SET_SERVICES,
  services: Array<ServiceType>
}

const setServices = (services: Array<ServiceType>): SetServicesActionType => (
  {
    type: SET_SERVICES, services
  }
)

// thunks

type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export const getFaqItems = (): ThunkType => async (
    dispatch
) => {
  try {
    let response = await generalSourcesApi.getFaqItems()
    dispatch(setFaqItems(response))
  } catch (e) {
    console.log(e)
  }
}

export const addFaqItem = (values: FaqType): ThunkType => async (dispatch) => {
  try {
    let response = await generalSourcesApi.addFaqItem(values)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setFaqItems(response.faqItems))
    }
  } catch (e) {
    console.log(e)
  }
}

export const updateFaqItem = (id: string, values: any): ThunkType => async (dispatch) => {
  try {
    let response = await generalSourcesApi.updateFaqItem(id, values)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setFaqItems(response.faqItems))
    }
  } catch (e) {
    console.log(e)
  }
}

export const deleteFaqItem = (id: string): ThunkType => async (dispatch) => {
  try {
    let response = await generalSourcesApi.deleteFaqItem(id)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setFaqItems(response.faqItems))
    }
  } catch (e) {
    console.log(e)
  }
}

export const getServices = (): ThunkType => async (dispatch) => {
  try {
    let response = await generalSourcesApi.getServices()
    dispatch(setServices(response));
  } catch (e) {
    console.log(e);
  }
}

export const getPages = (): ThunkType => async (dispatch) => {
  try {
    let response = await generalSourcesApi.getPages()
    dispatch(setPages(response.pages))
  } catch (e) {
    console.log(e);
  }
}

export const editAboutPage = (id: string, FormData: FormData): ThunkType => async (dispatch) => {
  try {
    let response = await generalSourcesApi.editAboutPage(id, FormData)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setPages(response.pages))
    }
  } catch (e) {
    console.log(e);
  }
}

export const changePageVisibility = (
    pageId: string,
    isActive: boolean
): ThunkType => async (dispatch) => {
  try {
    let response = await generalSourcesApi.changePageVisibility(pageId, isActive)
    dispatch(setPageVisibility(pageId, !isActive))
  } catch (e) {
    console.log(e)
  }
}

export const editService = (
    id: string,
    values: FormData
): ThunkType => async (dispatch) => {
  try {
    let response = await generalSourcesApi.editService(id, values)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setServices(response.services))
    }
  } catch (e) {
    console.log(e)
  }
}

export const addService = (
    values: FormData
): ThunkType => async (dispatch) => {
  try {
    let response = await generalSourcesApi.addService(values)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setServices(response.services))
    }
  } catch (e) {
    console.log(e)
  }
}

export const deleteService = (
    id: string
): ThunkType => async (dispatch) => {
  try {
    let response = await generalSourcesApi.deleteService(id)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setServices(response.services))
    }
  } catch (e) {
    console.log(e)
  }
}

