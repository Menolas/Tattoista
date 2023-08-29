import * as React from 'react'
import { useEffect } from 'react'
import {useDispatch, useSelector} from "react-redux";
import {
    getArchivedGalleryPageSizeSelector,
    getArchivedGallerySelector,
    getCurrentArchivedGalleryPageSelector,
    getTotalArchivedGalleryItemsCountSelector
} from "../../../redux/Portfolio/portfolio-selectors";
import {Paginator} from "../../common/Paginator";
import {
    deleteArchivedGalleryItem,
    getArchivedGallery, reactivateArchivedGalleryItem,
    setArchivedGalleryPageSizeAC,
    setCurrentArchivedGalleryPageAC
} from "../../../redux/Portfolio/portfolio-reducer";
import {SERVER_URL} from "../../../utils/constants";
import Sprite from '../../../assets/svg/sprite.svg'
import {NothingToShow} from "../../common/NothingToShow";

export const ArchivedGallery = () => {

    const totalArchivedGalleryItemsCount = useSelector(getTotalArchivedGalleryItemsCountSelector)
    const archivedGalleryPageSize = useSelector(getArchivedGalleryPageSizeSelector)
    const currentArchivedGalleryPage = useSelector(getCurrentArchivedGalleryPageSelector)
    const archivedGallery = useSelector(getArchivedGallerySelector)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getArchivedGallery(currentArchivedGalleryPage, archivedGalleryPageSize))
    }, [currentArchivedGalleryPage, archivedGalleryPageSize])

    const onPageChangedCallBack = (page: number) => {
        dispatch(setCurrentArchivedGalleryPageAC(page))
    }

    const setArchivedGalleryPageSizeACCallBack = (archivedGalleryPageSize: number) => {
        dispatch(setArchivedGalleryPageSizeAC(archivedGalleryPageSize))
    }

    const deleteArchivedGalleryItemCallBack = (itemId: string) => {
        dispatch(deleteArchivedGalleryItem(itemId))
    }

    const reactivateArchivedGalleryItemCallBack = (id: string) => {
        dispatch(reactivateArchivedGalleryItem(id))
    }

    const galleryItems = archivedGallery.map(item => {
        return (
            <li
                key={item._id}
                className="gallery__item"
            >
                <div
                    className={"gallery__img-wrap"}
                    //onClick={() => { showBigImg(item.fileName) }}
                    style={{ backgroundImage: `url(${SERVER_URL}archivedGallery/${item.fileName})` }}
                >
                    {''}
                </div>
                <div className={"gallery__item-actions"}>
                    <button
                        className={"btn btn--icon"}
                        onClick={() => {reactivateArchivedGalleryItemCallBack(item._id)}}
                    >
                        <svg><use href={`${Sprite}#smile`}/></svg>
                    </button>
                    <button
                        className={"btn btn--icon"}
                        onClick={() => {deleteArchivedGalleryItemCallBack(item._id)}}
                    >
                        <svg><use href={`${Sprite}#trash`}/></svg>
                    </button>
                </div>
            </li>
        )
    })

    return (
        <div>
            <div className="admin__cards-header">
                {
                    totalArchivedGalleryItemsCount && totalArchivedGalleryItemsCount > archivedGalleryPageSize &&
                    <>
                        <Paginator
                            totalCount={totalArchivedGalleryItemsCount}
                            pageSize={archivedGalleryPageSize}
                            currentPage={currentArchivedGalleryPage}
                            onPageChanged={onPageChangedCallBack}
                            setPageLimit={setArchivedGalleryPageSizeACCallBack}
                        />
                    </>
                }
            </div>
            { archivedGallery.length > 0
                ? <ul className="gallery__list list">
                    { galleryItems }
                </ul>
                : <NothingToShow/>
            }
        </div>
    )
}