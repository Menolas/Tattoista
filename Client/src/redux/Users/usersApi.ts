import axios, {AxiosRequestConfig, CreateAxiosDefaults} from "axios"
import {RoleType, UserType} from "../../types/Types"
import {API_URL} from "../../http"
import {UsersFilterType} from "./users-reducer"

const instance = axios.create({
    baseURL: API_URL
} as CreateAxiosDefaults)

type CommonResponseFields = {
    resultCode: number
    message?: string
}

type DeleteUserResponseType = CommonResponseFields

type GetUsersResponseType = CommonResponseFields & {
    users: Array<UserType>,
    totalCount: number
}

type GetRolesResponseType = CommonResponseFields & {
    roles: Array<RoleType>
}

type UpdateUserResponseType = CommonResponseFields & {
    user: UserType
}

type AddUserResponseType = UpdateUserResponseType


export const usersAPI = {

    getRoles() {
        return instance.get<GetRolesResponseType>('users/roles')
            .then(response => response.data)
    },

    getUsers(
        token: string,
        currentPage = 1,
        pageSize = 5,
        filter: UsersFilterType
    ) {
        return instance.get<GetUsersResponseType>(
            `${API_URL}/users?&page=${currentPage}&limit=${pageSize}&term=${filter.term}&role=${filter.condition}`,
            { headers: { Authorization: `Bearer ${token}` } } as AxiosRequestConfig)
                .then(response => response.data)
    },

    deleteUser(userId: string) {
        return instance.delete<DeleteUserResponseType>(`users/${userId}`)
            .then(response => response.data)
    },

    updateUser(
        userId: string,
        values: FormData
    ) {
        return instance.post<UpdateUserResponseType>(`users/edit/${userId}`, values)
            .then(response => response.data)
    },

    addUser(values: FormData) {
        return instance.post<AddUserResponseType>('users', values)
            .then(response => response.data)
    }
}
