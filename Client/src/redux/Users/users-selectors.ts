import {AppStateType} from "../redux-store"

export const getUsersSelector = (state: AppStateType) => {
    return state.users.users
}

export const getUsersTotalCountSelector = (state: AppStateType) => {
    return state.users.totalUsersCount
}

export const getUsersCurrentPageSelector = (state: AppStateType) => {
    return state.users.currentPage
}

export const getUsersPageLimitSelector = (state: AppStateType) => {
    return state.users.pageLimit
}

export const getUsersIsFetching = (state: AppStateType) => {
    return state.users.usersIsFetching
}

export const getUsersFiletSelector = (state: AppStateType) => {
    return state.users.usersFilter
}

export const getRolesSelector = (state: AppStateType) => {
    return state.users.roles
}

export const getIsSuccessSelector = (state: AppStateType) => {
    return state.users.isSuccess
}

export const getAccessErrorSelector = (state: AppStateType) => {
    return state.users.accessError
}
