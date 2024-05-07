import * as React from "react";
import { useEffect } from "react";
import {useDispatch, useSelector} from "react-redux";
import {Paginator} from "../../../common/Paginator";
import {NothingToShow} from "../../../common/NothingToShow";
import {Preloader} from "../../../common/Preloader";
import {
    deleteArchivedBooking,
    getArchivedBookings,
    reactivateBooking,
    setFilterAC,
    setPageSizeAC,
    setCurrentPageAC,
} from "../../../../redux/ArchivedBookings/archived-bookings-reducer";
import {
    getFilterSelector,
    getPageSizeSelector,
    getArchivedBookingsSelector,
    getCurrentPageSelector,
    getIsFetchingSelector,
    getTotalCountSelector,
    getIsDeletingInProcessSelector,
    getAccessErrorSelector,
} from "../../../../redux/ArchivedBookings/archived-bookings-selectors";
import {ArchivedBooking} from "./ArchivedBooking";
import {SearchFilterForm} from "../../../Forms/SearchFilterForm";
import {bookingFilterSelectOptions} from "../../../../utils/constants";
import {getTokenSelector} from "../../../../redux/Auth/auth-selectors";
import {Navigate} from "react-router";
import {SearchFilterType} from "../../../../types/Types";

export const ArchivedBookings: React.FC = () => {
    const isFetching = useSelector(getIsFetchingSelector);
    const isDeletingInProcess = useSelector(getIsDeletingInProcessSelector);
    const archivedBookings = useSelector(getArchivedBookingsSelector);
    const totalCount = useSelector(getTotalCountSelector);
    const pageSize = useSelector(getPageSizeSelector);
    const currentPage = useSelector(getCurrentPageSelector);
    const filter = useSelector(getFilterSelector);
    const token = useSelector(getTokenSelector);
    const accessError = useSelector(getAccessErrorSelector);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getArchivedBookings(token, currentPage, pageSize, filter));
    }, [token, currentPage, pageSize, filter]);

    const onPageChangedCallBack = (
        page: number
    ) => {
        dispatch(setCurrentPageAC(page));
    }

    const setPageSizeCallBack = (
        pageSize: number
    ) => {
        dispatch(setPageSizeAC(pageSize));
    }

    const onFilterChangeCallBack = (
        filter: SearchFilterType
    ) => {
        dispatch(setFilterAC(filter));
    }

    const removeCallBack = (
        clientId: string
    ) => {
        dispatch(deleteArchivedBooking(
            token,
            clientId,
            archivedBookings,
            currentPage,
            totalCount,
            pageSize,
            filter
        ));
    }

    const reactivateCallBack = (
        id: string
    ) => {
        dispatch(reactivateBooking(
            token,
            id,
            archivedBookings,
            currentPage,
            totalCount,
            pageSize,
            filter
        ));
    }

    const archivedConsultationsArray = archivedBookings
        .map(data => {
            return (
                <ArchivedBooking
                    key={data._id}
                    data={data}
                    remove={removeCallBack}
                    reactivate={reactivateCallBack}
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
                            setPageLimit={setPageSizeCallBack}
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
                </>
            }
        </>
    )
}