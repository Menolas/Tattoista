import * as React from "react"
import {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import { Users } from "./Users"
import {
    deleteUser,
    getRoles,
    getUsers,
    setUsersCurrentPageAC,
    setUsersFilterAC,
    setUsersPageLimitAC,
    updateUser,
    setIsSuccessAC,
    UsersFilterType, addUser
} from "../../../redux/Users/users-reducer"
import {
    getIsSuccessSelector,
    getRolesSelector,
    getUsersCurrentPageSelector,
    getUsersFiletSelector,
    getUsersIsFetching,
    getUsersPageLimitSelector,
    getUsersSelector,
    getUsersTotalCountSelector,
    getAccessErrorSelector
} from "../../../redux/Users/users-selectors"
import {getTokenSelector} from "../../../redux/Auth/auth-selectors"

export const UsersContainer: React.FC = () => {

    const token = useSelector(getTokenSelector)
    const roles = useSelector(getRolesSelector)
    const users = useSelector(getUsersSelector)
    const isFetching = useSelector(getUsersIsFetching)
    const total = useSelector(getUsersTotalCountSelector)
    const currentPage = useSelector(getUsersCurrentPageSelector)
    const pageLimit = useSelector(getUsersPageLimitSelector)
    const filter = useSelector(getUsersFiletSelector)
    const isSuccess = useSelector(getIsSuccessSelector)
    const accessError = useSelector(getAccessErrorSelector)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getRoles())
        dispatch(getUsers(token, currentPage, pageLimit, filter))
    }, [token, currentPage, pageLimit, filter])

    const setUsersPageLimitCallBack = (limit: number) => {
        dispatch(setUsersPageLimitAC(limit))
    }

    const setUsersCurrentPageCallBack = (page: number) => {
        dispatch(setUsersCurrentPageAC(page))
    }

    const setClientsFilterCallBack = (filter: UsersFilterType) => {
        dispatch(setUsersFilterAC(filter))
    }

    const deleteUserCallBack = (userId: string) => {
        dispatch(deleteUser(token, userId, users, currentPage, total, pageLimit, filter))
    }

    const setIsSuccessCallBack = (bol: boolean) => {
        dispatch(setIsSuccessAC(bol))
    }

    const updateUserCallBack = (
        id: string,
        values: FormData
    ) => {
        dispatch(updateUser(id, values))
    }

    const addUserCallBack = (values: FormData) => {
        dispatch(addUser(values, total))
    }

    return (
        <Users
            roles={roles}
            users={users}
            filter={filter}
            isFetching={isFetching}
            total={total}
            currentPage={currentPage}
            pageLimit={pageLimit}
            isSuccess={isSuccess}
            accessError={accessError}
            setUsersPageLimit={setUsersPageLimitCallBack}
            setUsersCurrentPage={setUsersCurrentPageCallBack}
            setClientsFilter={setClientsFilterCallBack}
            deleteUser={deleteUserCallBack}
            updateUser={updateUserCallBack}
            addUser={addUserCallBack}
            setIsSuccess={setIsSuccessCallBack}
        />
    )
}
