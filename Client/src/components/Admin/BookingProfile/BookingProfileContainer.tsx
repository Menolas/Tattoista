import * as React from "react";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {
  getBookingProfile,
  deleteBooking,
  archiveBooking, changeStatus, turnBookingToClient,
} from "../../../redux/Bookings/bookings-reducer";
import { BookingProfile } from "./BookingProfile";
import {
  getBookingProfileSelector,
  getCurrentPageSelector,
  getPageSizeSelector,
  getBookingsSelector,
  getFilterSelector,
  getIsDeletingInProcessSelector,
  getIsStatusChangingSelector,
  getIsFetchingSelector,
} from "../../../redux/Bookings/bookings-selectors";
import {getApiErrorSelector} from "../../../redux/General/general-selectors";
import {ApiErrorMessageModal} from "../../common/ApiErrorMessageModal";
import {setApiErrorAC} from "../../../redux/General/general-reducer";
import {getTokenSelector} from "../../../redux/Auth/auth-selectors";
import {AppDispatch} from "../../../redux/redux-store";
import {Preloader} from "../../common/Preloader";

export const BookingProfileContainer: React.FC = () => {

  const token = useSelector(getTokenSelector);
  const currentPage = useSelector(getCurrentPageSelector);
  const pageSize = useSelector(getPageSizeSelector);
  const bookings = useSelector(getBookingsSelector);
  const filter = useSelector(getFilterSelector);
  const bookingProfile = useSelector(getBookingProfileSelector);
  const apiError = useSelector(getApiErrorSelector);
  const isDeletingInProcess = useSelector(getIsDeletingInProcessSelector);
  const isStatusChanging = useSelector(getIsStatusChangingSelector);
  const isFetching = useSelector(getIsFetchingSelector);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const bookingIdFromUrl = urlParams.get('bookingId');

    if (bookingIdFromUrl && (!bookingProfile || bookingProfile._id !== bookingIdFromUrl)) {
      dispatch(getBookingProfile(token, bookingIdFromUrl));
    }
  }, [dispatch]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const bookingIdFromUrl = urlParams.get('bookingId');

    if (bookingProfile && bookingProfile._id !== bookingIdFromUrl) {
      navigate(`?bookingId=${bookingProfile._id}`);
    }
  }, [bookingProfile, navigate]);

  const setApiErrorCallBack = () => {
    dispatch(setApiErrorAC(null));
  };

  const deleteBookingCallBack = async () => {
    let success = await dispatch(deleteBooking(
        token,
        bookingProfile._id,
        bookings,
        currentPage,
        pageSize,
        filter
    ));
    if (success) {
      navigate("/admin/bookedConsultations");
    }
  };

  const turnBookingToClientCallBack = async () => {
    let success = await dispatch(turnBookingToClient(
        token,
        bookingProfile._id,
        bookings,
        currentPage,
        pageSize,
        filter
    ));
    if (success) {
      navigate("/admin/bookedConsultations");
    }
  }

  const changeStatusCallBack = async () => {
    try {
      await dispatch(changeStatus(token, bookingProfile._id));
      await dispatch(getBookingProfile(token, bookingProfile._id));
    } catch (error) {
      console.log('Error changing status and fetching updated booking:', error);
    }
  };

  const archiveBookingCallBack = async () => {
    let success = await dispatch(archiveBooking(
        token,
        bookingProfile._id,
        bookings,
        currentPage,
        pageSize,
        filter
    ));
    if (success) {
        navigate("/admin/bookedConsultations");
    }
  };

  return (
    <>
      {isFetching
        ? <Preloader />
        : <BookingProfile
              data={bookingProfile}
              isDeletingInProcess={isDeletingInProcess}
              isStatusChanging={isStatusChanging}
              changeStatus={changeStatusCallBack}
              turnBookingToClient={turnBookingToClientCallBack}
              remove={deleteBookingCallBack}
              archive={archiveBookingCallBack}
          />
      }
      {apiError &&
          <ApiErrorMessageModal
              isOpen={!!apiError}
              error={apiError}
              closeModal={setApiErrorCallBack}
          />
      }
    </>
  );
};
