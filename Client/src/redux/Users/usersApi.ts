import {AxiosRequestConfig} from "axios";
import {RoleType, SearchFilterType, UserType, CommonResponseFields} from "../../types/Types";
import {instance} from "../../http";

type DeleteUserResponseType = CommonResponseFields;

type GetUsersResponseType = CommonResponseFields & {
    users: Array<UserType>;
    totalCount: number;
}

type GetRolesResponseType = CommonResponseFields & {
    roles: Array<RoleType>;
}

type UpdateUserResponseType = CommonResponseFields & {
    user: UserType;
}

type AddUserResponseType = UpdateUserResponseType;

export const usersAPI = {

    async getRoles() {
        return await instance.get<GetRolesResponseType>('users/roles')
            .then(response => response.data);
    },

    async getUsers(
        token: string,
        currentPage = 1,
        pageSize = 5,
        filter: SearchFilterType
    ) {
        return await instance.get<GetUsersResponseType>(
            `users?&page=${currentPage}&limit=${pageSize}&term=${filter.term}&role=${filter.condition}`,
            { headers: { Authorization: `Bearer ${token}` } } as AxiosRequestConfig)
                .then(response => response.data);
    },

    async deleteUser(userId: string) {
        return await instance.delete<DeleteUserResponseType>(`users/${userId}`)
            .then(response => response.data);
    },

    async updateUser(
        userId: string,
        values: FormData
    ) {
        return await instance.post<UpdateUserResponseType>(`users/edit/${userId}`, values)
            .then(response => response.data);
    },

    async addUser(values: FormData) {
        return await instance.post<AddUserResponseType>('users', values)
            .then(response => response.data);
    },
};
