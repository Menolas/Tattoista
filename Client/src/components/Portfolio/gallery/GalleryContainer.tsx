import * as React from "react";
import {Gallery} from "./Gallery";
import {GalleryInfiniteScroll} from "./GalleryInfiniteScroll";
import {
  setCurrentGalleryPageAC,
  setGalleryPageSizeAC,
} from "../../../redux/Gallery/gallery-reducer";
import {useDispatch, useSelector} from "react-redux";
import {getAuthSelector} from "../../../redux/Auth/auth-selectors";
import {
  getCurrentPageSelector,
  getFakeApiSelector,
  getPageSizeSelector,
  getIsFetchingSelector,
  getIsDeletingInProcessSelector,
  getTotalCountSelector
} from "../../../redux/Gallery/gallery-selectors";

import {
  getActiveStyleSelector,
  getStylesSelector,
} from "../../../redux/Styles/styles-selectors";
import {getApiErrorSelector} from "../../../redux/General/general-selectors";
import {ADMIN, SUPER_ADMIN, USER} from "../../../utils/constants";

export const GalleryContainer: React.FC = () => {

  const isAuth = useSelector(getAuthSelector);
  const isFetching = useSelector(getIsFetchingSelector);
  const isDeletingInProcess = useSelector(getIsDeletingInProcessSelector);
  const fakeApi = useSelector(getFakeApiSelector);
  const totalCount = useSelector(getTotalCountSelector);
  const pageSize = useSelector(getPageSizeSelector);
  const currentPage = useSelector(getCurrentPageSelector);
  const styles = useSelector(getStylesSelector);
  const activeStyle = useSelector(getActiveStyleSelector);
  const apiError = useSelector(getApiErrorSelector);

  const dispatch = useDispatch();
  const setPageCallBack = (page: number) => {
    dispatch(setCurrentGalleryPageAC(page));
  }

  const setGalleryPageSizeCallBack = (pageSize: number) => {
    dispatch(setGalleryPageSizeAC(pageSize));
  }

  return (
      <>
        { (isAuth === ADMIN || isAuth === SUPER_ADMIN) &&
          <Gallery
              isFetching={isFetching}
              activeStyle={activeStyle}
              totalCount={totalCount}
              pageSize={pageSize}
              currentPage={currentPage}
              styles={styles}
              isDeletingInProcess={isDeletingInProcess}
              apiError={apiError}
              setPage={setPageCallBack}
              setPageSize={setGalleryPageSizeCallBack}
          />
        }
        { (!isAuth || isAuth === USER) &&
            <GalleryInfiniteScroll
                fakeApi={fakeApi}
                activeStyle={activeStyle}
                pageSize={pageSize}
            />
        }
      </>
  );
}
