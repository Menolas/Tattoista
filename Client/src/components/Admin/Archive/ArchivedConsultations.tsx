import * as React from "react"
import { useEffect } from "react"
import {useDispatch, useSelector} from "react-redux"
import {Paginator} from "../../common/Paginator"
import {NothingToShow} from "../../common/NothingToShow"
import {Preloader} from "../../common/Preloader"
import {
    BookedConsultationsFilterType,
    deleteArchivedConsultation,
    getArchivedConsultations,
    reactivateConsultation, setAddBookingApiErrorAC,
    setArchivedConsultationsFilterAC,
    setArchivedConsultationsPageSizeAC,
    setCurrentPageForArchivedConsultationsAC
} from "../../../redux/bookedConsultations/bookedConsultations-reducer"
import {
    getArchivedConsultationsFilterSelector,
    getArchivedConsultationsPageSizeSelector,
    getArchivedConsultationsSelector,
    getCurrentArchivedConsultationsPageSelector,
    getBookedConsultationsIsFetchingSelector,
    getTotalArchivedConsultationsCountSelector,
    getIsDeletingInProcessSelector,
    getAddBookingApiErrorSelector,
    getAccessErrorSelector,
} from "../../../redux/bookedConsultations/bookedConsultations-selectors"
import {ArchivedConsultation} from "./ArchivedConsultation"
import {ApiErrorMessage} from "../../common/ApiErrorMessage"
import {SearchFilterForm} from "../../Forms/SearchFilterForm"
import {bookingFilterSelectOptions} from "../../../utils/constants"
import {getTokenSelector} from "../../../redux/Auth/auth-selectors";
import {Navigate} from "react-router";

export const ArchivedConsultations: React.FC = () => {
    const isFetching = useSelector(getBookedConsultationsIsFetchingSelector)
    const isDeletingInProcess = useSelector(getIsDeletingInProcessSelector)
    const archivedConsultations = useSelector(getArchivedConsultationsSelector)
    const totalCount = useSelector(getTotalArchivedConsultationsCountSelector)
    const pageSize = useSelector(getArchivedConsultationsPageSizeSelector)
    const currentPage = useSelector(getCurrentArchivedConsultationsPageSelector)
    const filter = useSelector(getArchivedConsultationsFilterSelector)
    const addBookingApiError = useSelector(getAddBookingApiErrorSelector)
    const token = useSelector(getTokenSelector)
    const accessError = useSelector(getAccessErrorSelector)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getArchivedConsultations(token, currentPage, pageSize, filter))
    }, [token, currentPage, pageSize, filter])

    const onPageChangedCallBack = (
        page: number
    ) => {
        dispatch(setCurrentPageForArchivedConsultationsAC(page))
    }

    const setArchivedConsultationsPageSizeCallBack = (
        pageSize: number
    ) => {
        dispatch(setArchivedConsultationsPageSizeAC(pageSize))
    }

    const onFilterChangeCallBack = (
        filter: BookedConsultationsFilterType
    ) => {
        dispatch(setArchivedConsultationsFilterAC(filter))
    }

    const deleteArchivedConsultationCallBack = (
        clientId: string
    ) => {
        dispatch(deleteArchivedConsultation(
            token,
            clientId,
            archivedConsultations,
            currentPage,
            totalCount,
            pageSize,
            filter
        ))
    }

    const reactivateConsultationCallBack = (
        id: string
    ) => {
        dispatch(reactivateConsultation(
            token,
            id,
            archivedConsultations,
            currentPage,
            totalCount,
            pageSize,
            filter
        ))
    }

    const setAddBookingApiErrorCallBack = (error: string) => {
        dispatch(setAddBookingApiErrorAC(error))
    }

    const archivedConsultationsArray = archivedConsultations
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

                    {addBookingApiError && addBookingApiError !== '' &&
                        <ApiErrorMessage
                            error={addBookingApiError}
                            closeModal={setAddBookingApiErrorCallBack}
                        />
                    }
                </>
            }
        </>
    )
}
