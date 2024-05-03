import * as React from "react";
import {useDispatch, useSelector} from "react-redux";
import {About} from "./About";
import {
    getPageSelector,
    getFakeApiSelector,
    getIsFetchingSelector,
} from "../../../redux/About/about-selectors";
import {
    getAboutPage,
    editAboutPage,
    changeAboutPageVisibility,
} from "../../../redux/About/about-reducer";
import {useEffect} from "react";
import {getAuthSelector} from "../../../redux/Auth/auth-selectors";


export const AboutContainer = () => {
    const isAuth = useSelector(getAuthSelector);
    const fakeApi = useSelector(getFakeApiSelector);
    const page = useSelector(getPageSelector);
    const isFetching = useSelector(getIsFetchingSelector);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAboutPage());
    }, [dispatch]);

    const editAboutPageCallBack = (values: FormData) => {
        dispatch(editAboutPage(values));
    }

    const changeAboutPageVisibilityCallBack = (isActive: boolean) => {
        dispatch(changeAboutPageVisibility(isActive));
    }

    if  (isAuth || page?.isActive) {
        return (
            <About
                isFetching={isFetching}
                fakeApi={fakeApi}
                isAuth={isAuth}
                page={page}
                edit={editAboutPageCallBack}
                changeVisibility={changeAboutPageVisibilityCallBack}
            />
        )
    } else {
        return null;
    }

}