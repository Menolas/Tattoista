import * as React from "react";
import { useEffect } from "react";
import {useDispatch, useSelector} from "react-redux";
import {Paginator} from "../../../common/Paginator";
import {NothingToShow} from "../../../common/NothingToShow";
import {Preloader} from "../../../common/Preloader";
import {
    deleteArchivedConsultation,
    getArchivedConsultations,
    reactivateConsultation,
    setApiErrorAC,
    setArchivedConsultationsFilterAC,
    setArchivedConsultationsPageSizeAC,
    setCurrentPageForArchivedConsultationsAC, setSuccessModalAC
} from "../../../../redux/ArchivedBookings/archived-bookings-reducer";
import {
    getArchivedConsultationsFilterSelector,
    getArchivedConsultationsPageSizeSelector,
    getArchivedBookingsSelector,
    getCurrentArchivedConsultationsPageSelector,
    getBookedConsultationsIsFetchingSelector,
    getTotalArchivedConsultationsCountSelector,
    getIsDeletingInProcessSelector,
    getApiErrorSelector,
    getAccessErrorSelector, getSuccessModalSelector,
} from "../../../../redux/ArchivedBookings/archived-bookings-selectors";
import {ArchivedConsultation} from "./ArchivedConsultation";
import {ApiErrorMessage} from "../../../common/ApiErrorMessage";
import {SearchFilterForm} from "../../../Forms/SearchFilterForm";
import {bookingFilterSelectOptions} from "../../../../utils/constants";
import {getTokenSelector} from "../../../../redux/Auth/auth-selectors";
import {Navigate} from "react-router";
import {SuccessPopUp} from "../../../common/SuccessPopUp";
import {SearchFilterType} from "../../../../types/Types";

export const ArchivedConsultations: React.FC = () => {
    const isFetching = useSelector(getBookedConsultationsIsFetchingSelector);
    const isDeletingInProcess = useSelector(getIsDeletingInProcessSelector);
    const archivedBookings = useSelector(getArchivedBookingsSelector);
    const totalCount = useSelector(getTotalArchivedConsultationsCountSelector);
    const pageSize = useSelector(getArchivedConsultationsPageSizeSelector);
    const currentPage = useSelector(getCurrentArchivedConsultationsPageSelector);
    const filter = useSelector(getArchivedConsultationsFilterSelector);
    const apiError = useSelector(getApiErrorSelector);
    const token = useSelector(getTokenSelector);
    const accessError = useSelector(getAccessErrorSelector);
    const successModal = useSelector(getSuccessModalSelector);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getArchivedConsultations(token, currentPage, pageSize, filter));
    }, [token, currentPage, pageSize, filter]);

    useEffect(() => {
        if (successModal.isSuccess) {
            setTimeout( () => {
                setSuccessModalCallBack();
            }, 3000);
        }
    }, [successModal]);

    const onPageChangedCallBack = (
        page: number
    ) => {
        dispatch(setCurrentPageForArchivedConsultationsAC(page));
    }

    const setArchivedConsultationsPageSizeCallBack = (
        pageSize: number
    ) => {
        dispatch(setArchivedConsultationsPageSizeAC(pageSize));
    }

    const onFilterChangeCallBack = (
        filter: SearchFilterType
    ) => {
        dispatch(setArchivedConsultationsFilterAC(filter));
    }

    const deleteArchivedConsultationCallBack = (
        clientId: string
    ) => {
        dispatch(deleteArchivedConsultation(
            token,
            clientId,
            archivedBookings,
            currentPage,
            totalCount,
            pageSize,
            filter
        ));
    }

    const reactivateConsultationCallBack = (
        id: string
    ) => {
        dispatch(reactivateConsultation(
            token,
            id,
            archivedBookings,
            currentPage,
            totalCount,
            pageSize,
            filter
        ));
    }

    const setApiErrorCallBack = () => {
        dispatch(setApiErrorAC(''));
    }

    const setSuccessModalCallBack = () => {
        dispatch(setSuccessModalAC(false, ''));
    }

    const archivedConsultationsArray = archivedBookings
        .map(consultation => {
            return (
                <ArchivedConsultation
                    key={consultation._id}
                    consultation={consultation}
                    deleteArchivedConsultation={deleteArchivedConsultationCallBack}
                    reactivateConsultation={reactivateConsultationCallBack}
                    isDeletingInProcess={isDeletingInProcess}
                />
            )
        })

    return (
        <>
            {(accessError && accessError !== '')
                ? <Navigate to="/noAccess"/>
                : <>
                    <div className="admin__cards-header">
                        <SearchFilterForm
                            options={bookingFilterSelectOptions}
                            filter={filter}
                            onFilterChanged={onFilterChangeCallBack}
                        />
                        <Paginator
                            totalCount={totalCount}
                            pageSize={pageSize}
                            currentPage={currentPage}
                            onPageChanged={onPageChangedCallBack}
                            setPageLimit={setArchivedConsultationsPageSizeCallBack}
                        />
                    </div>
                    {isFetching
                        ? <Preloader/>
                        : totalCount && totalCount > 0
                            ? (
                                <ul className="admin__cards-list list">
                                    {archivedConsultationsArray}
                                </ul>
                            ) : <NothingToShow/>
                    }
                    <ApiErrorMessage
                        isOpen={!!apiError}
                        error={apiError}
                        closeModal={setApiErrorCallBack}
                    />
                    <SuccessPopUp
                        isOpen={successModal.isSuccess}
                        closeModal={setSuccessModalCallBack}
                        content={successModal.successText}
                    />
                </>
            }
        </>
    )
}