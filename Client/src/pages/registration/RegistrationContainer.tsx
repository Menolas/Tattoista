import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Registration } from "./Registration";
import {
    getSuccessModalSelector,
} from "../../redux/General/general-selectors";
import {setSuccessModalAC} from "../../redux/General/general-reducer";
import {
    getAuthSelector,
    getUserSelector,
    getAuthApiErrorSelector
} from "../../redux/Auth/auth-selectors";
import {SuccessPopUp} from "../../components/common/SuccessPopUp";
import {useCallback, useEffect} from "react";

export const RegistrationContainer: React.FC = () => {

    const isAuth = useSelector(getAuthSelector);
    const user = useSelector(getUserSelector);
    const successModal = useSelector(getSuccessModalSelector);
    const authApiError = useSelector(getAuthApiErrorSelector);

    const dispatch = useDispatch();

    const setSuccessModalCallBack = useCallback(() => {
        dispatch(setSuccessModalAC(false, ''));
    }, [dispatch]);

    useEffect(() => {
        if (successModal.isSuccess) {
            setTimeout( () => {
                setSuccessModalCallBack();
            }, 3000);
        }
    }, [successModal, setSuccessModalCallBack]);

    return (
        <>
            <Registration
                isAuth={isAuth}
                user={user}
                authApiError={authApiError}
            />
            <SuccessPopUp
                isOpen={successModal.isSuccess}
                closeModal={setSuccessModalCallBack}
                content={successModal.successText}
            />
        </>
    )
}
