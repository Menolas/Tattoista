import * as React from "react";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
  getClients,
  setCurrentPageAC,
  addClient,
  deleteClient,
  editClient,
  updateClientGallery,
  deleteClientGalleryPicture,
  archiveClient,
  setPageSize,
  setFilterAC,
} from "../../../redux/Clients/clients-reducer";
import {
  getClientsIsFetching,
  getTotalClientsCount,
  getCurrentClientsPage,
  getClientsSelector,
  getIsClientDeletingInProcessSelector,
  getClientsFilterSelector,
  getClientsPageSizeSelector,
  getIsDeletingPicturesInProcessSelector
} from "../../../redux/Clients/clients-selectors";
import { Clients } from "./Clients";
import {getTokenSelector} from "../../../redux/Auth/auth-selectors";
import {getAccessErrorSelector} from "../../../redux/Bookings/bookings-selectors";
import {SearchFilterType} from "../../../types/Types";

export const ClientsContainer: React.FC = () => {

  const isFetching = useSelector(getClientsIsFetching);
  const currentPage = useSelector(getCurrentClientsPage);
  const totalCount = useSelector(getTotalClientsCount);
  const pageSize = useSelector(getClientsPageSizeSelector);
  const clients = useSelector(getClientsSelector);
  const filter = useSelector(getClientsFilterSelector);
  const isDeletingInProcess = useSelector(getIsClientDeletingInProcessSelector);
  const isDeletingPicturesInProcess = useSelector(getIsDeletingPicturesInProcessSelector);
  const token = useSelector(getTokenSelector);
  const accessError = useSelector(getAccessErrorSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getClients(token, currentPage, pageSize, filter));

  }, [dispatch, token, currentPage, pageSize, filter]);

  useEffect(() => {
    dispatch(setCurrentPageAC(1));
  }, [dispatch, filter]);

  const setCurrentPageCallBack = (
    page: number
  ) => {
    dispatch(setCurrentPageAC(page));
  }

  const onFilterChangedCallBack = (
    filter: SearchFilterType
  ) => {
    dispatch(setFilterAC(filter));
  }

  const addClientCallBack = (
    values: FormData
  ) => {
    dispatch(addClient(values, totalCount));
  }

  const deleteClientCallBack = (
    clientId: string
  ) => {
    dispatch(deleteClient(token, clientId, clients, currentPage, totalCount, pageSize, filter));
  }

  const editClientCallBack = (
    clientId: string,
    values: FormData
  ) => {
    dispatch(editClient(clientId, values));
  }

  const setPageLimitCallBack = (
    clientsPageSize: number
  ) => {
    dispatch(setPageSize(clientsPageSize));
  }

  const updateClientGalleryCallBack = (clientId: string, values: FormData) => {
    dispatch(updateClientGallery(clientId, values));
  }

  const deleteClientGalleryPictureCallBack = (clientId: string, picture: string) => {
    dispatch(deleteClientGalleryPicture(clientId, picture));
  }

  const archiveClientCallBack = (clientId: string) => {
    dispatch(archiveClient(token, clientId, clients, currentPage, totalCount, pageSize, filter));
  }

  return (
      <Clients
          isFetching={isFetching}
          totalCount={totalCount}
          currentPage={currentPage}
          pageSize={pageSize}
          clients={clients}
          clientsFilter={filter}
          isDeletingInProcess={isDeletingInProcess}
          isDeletingPicturesInProcess={isDeletingPicturesInProcess}
          accessError={accessError}
          onPageChanged={setCurrentPageCallBack}
          onFilterChanged={onFilterChangedCallBack}
          add={addClientCallBack}
          remove={deleteClientCallBack}
          edit={editClientCallBack}
          setPageLimit={setPageLimitCallBack}
          updateGallery={updateClientGalleryCallBack}
          deleteGalleryItem={deleteClientGalleryPictureCallBack}
          archive={archiveClientCallBack}
      />
  )
}
