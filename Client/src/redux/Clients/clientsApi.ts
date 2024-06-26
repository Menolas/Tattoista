import {AxiosRequestConfig} from "axios";
import {ClientType, SearchFilterType, CommonResponseFields} from "../../types/Types";
import {instance} from "../../http";

type DeleteClientResponseType = CommonResponseFields

type ArchiveClientResponseType = CommonResponseFields

type GetClientsResponseType = CommonResponseFields & {
    clients: Array<ClientType>,
    totalCount: number
}

type UpdateClientResponseType = CommonResponseFields & {
  client: ClientType
}

type GetClientProfileResponseType = UpdateClientResponseType

type DeleteClientGalleryPictureResponseType = UpdateClientResponseType

export const clientsAPI = {

  getClients(
    token: string | null,
    currentPage = 1,
    pageSize = 5,
    filter: SearchFilterType
  ) {
    return instance.get<GetClientsResponseType>(
        `clients?&page=${currentPage}&limit=${pageSize}&term=${filter.term}&gallery=${filter.condition}`,
        { headers: { Authorization: `Bearer ${token}` } } as AxiosRequestConfig)
            .then(response => response.data);
  },

  getArchivedClients(
      currentPage = 1,
      pageSize = 5,
      filter: SearchFilterType
  ) {
      return instance.get<GetClientsResponseType>(
          `clients/archive?&page=${currentPage}&limit=${pageSize}&term=${filter.term}&gallery=${filter.condition}`)
          .then(response => response.data);
  },

  getClientProfile(clientId: string) {
    return instance.get<GetClientProfileResponseType>(`clients/${clientId}`)
        .then(response => response.data);
  },

  updateClientGallery(clientId: string, values: FormData) {
    return instance.post<UpdateClientResponseType>(`clients/updateGallery/${clientId}`,
        values
    ).then(response => response.data);
  },

  deleteClient(clientId: string) {
    return instance.delete<DeleteClientResponseType>(`clients/${clientId}`)
        .then(response => response.data);
  },

  addClient(
    values: FormData,
    //values: AddClientFormValues
  ) {
    return instance.post<UpdateClientResponseType>('clients', values)
      .then(response => response.data)
  },

  editClient(
    clientId: string,
    values: FormData,
  ) {
     return instance.post<UpdateClientResponseType>(`clients/edit/${clientId}`, values)
        .then(response => response.data);
  },

  deleteClientGalleryPicture(
      clientId: string,
      picture: string
  ) {
      return instance.delete<DeleteClientGalleryPictureResponseType>(`clients/updateGallery/${clientId}?&picture=${picture}`)
          .then(response => response.data);
  },

  archiveClient(
      clientId: string
  ) {
      return instance.post<ArchiveClientResponseType>(`clients/archive/${clientId}`)
          .then(response => response.data);
  },
}
