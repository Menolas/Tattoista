import { AppStateType } from '../redux-store'

export const getAuthSelector = (state: AppStateType) => {
  return state.auth.isAuth
}

export const getTokenSelector = (state: AppStateType) => {
  return state.auth.token
}

export const getUserSelector = (state: AppStateType) => {
  return state.auth.user
}

export const getIsSuccessSelector = (state: AppStateType) => {
  return state.auth.isSuccess
}

//username: null,
//password: null,











