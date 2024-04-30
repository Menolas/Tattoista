import * as React from "react";
import { useState } from "react";
import { Preloader } from "../../common/Preloader";
import {GalleryItemType, TattooStyleType} from "../../../types/Types";
import { ModalPopUp } from "../../common/ModalPopUp";
import {API_URL} from "../../../http";
import {Tooltip} from "react-tooltip";
// @ts-ignore
import Sprite from "../../../assets/svg/sprite.svg";
import {Paginator} from "../../common/Paginator";
import {UpdateGalleryItemForm} from "../../Forms/UpdateGalleryItemForm";
import {NothingToShow} from "../../common/NothingToShow";
import {GalleryUploadForm} from "../../Forms/GalleryUploadForm";
import {ADMIN, SUPER_ADMIN} from "../../../utils/constants";
import {ImageFullView} from "../../common/ImageFullView";
import {Confirmation} from "../../common/Confirmation";

type PropsType = {
  fakeApi: boolean
  isAuth: string
  isFetching: boolean
  totalCount: number
  pageSize: number
  currentPage: number
  activeStyle: TattooStyleType
  gallery: Array<GalleryItemType>
  isDeletingInProcess: Array<string>
  styles: Array<TattooStyleType>
  updateGallery: (values: FormData) => void
  remove: (itemId: string) => void
  setCurrentPage: (page: number) => void
  setPageSize: (limit: number) => void
  archive: (id: string) => void
  updateItem: (id: string, values: object) => void
}

export const Gallery: React.FC<PropsType> = React.memo(({
  fakeApi,
  isAuth,
  isFetching,
  activeStyle,
  totalCount,
  pageSize,
  currentPage,
  gallery,
  isDeletingInProcess,
  styles,
  setCurrentPage,
  setPageSize,
  updateGallery,
  remove,
  archive,
  updateItem,
}) => {

  const [carouselData, setCarouselData] = useState<{ isOpen: boolean, activeIndex?: number }>({isOpen: false});
  const [ editGalleryMode, setEditGalleryMode ] = useState(false);
  const [ galleryItem, setGalleryItem ] = useState(null);
  const [confirmationData, setConfirmationData] = useState<{needConfirmation: boolean, itemId?: string}>({
    needConfirmation: false,
  });
  const [confirmationForArchivingData, setConfirmationForArchivingData] = useState<{needConfirmation: boolean, itemId?: string}>({
    needConfirmation: false,
  });

  const openEditGalleryForm = () => {
    setEditGalleryMode(true);
  }

  const closeEditGalleryForm = () => {
    setEditGalleryMode(false);
  }

  const closeGalleryItemEditModal = () => {
    setGalleryItem(null);
    setEditGalleryMode(false);
  }

  const closeConfirmationModalCallBack = () => {
    setConfirmationData({ needConfirmation: false });
    setConfirmationForArchivingData({needConfirmation: false});
  }

  const GalleryItemsArray = gallery?.map((item, index) => {
    const GalleryImgUrl = fakeApi
        ? `./uploads/gallery/${item.fileName}`
        : `${API_URL}/gallery/${item.fileName}`;

    return (
        <li
            key={item._id}
            className="gallery__item"
        >
          <div
            className={"gallery__img-wrap"}
            onClick={() => {
              setCarouselData({isOpen: true, activeIndex: index});
            }}
            style={{ backgroundImage: `url(${GalleryImgUrl})` }}
          >
            {''}
          </div>
          {(isAuth === ADMIN || isAuth === SUPER_ADMIN) &&
            <div className={"gallery__item-actions"}>
              <button
                  data-tooltip-id="my-tooltip"
                  data-tooltip-content="Edit gallery item"
                  className={"btn btn--icon"}
                  onClick={() => { setGalleryItem(item); }}
              >
                  <svg><use href={`${Sprite}#edit`}/></svg>
              </button>
              <button
                  data-tooltip-id="my-tooltip"
                  data-tooltip-content="Move gallery item to archive"
                  className={"btn btn--icon"}
                  disabled={isDeletingInProcess?.some(id => id === item._id)}
                  onClick={() => {
                    setConfirmationForArchivingData({needConfirmation: true, itemId: item._id});
                  }}
              >
                  <svg><use href={`${Sprite}#archive`}/></svg>
              </button>
              <button
                  data-tooltip-id="my-tooltip"
                  data-tooltip-content="Delete gallery item"
                  className={"btn btn--icon"}
                  disabled={isDeletingInProcess?.some(id => id === item._id)}
                  onClick={() => {
                    setConfirmationData({ needConfirmation: true, itemId: item._id });
                  }}
              >
                  <svg><use href={`${Sprite}#trash`}/></svg>
              </button>
            </div>
          }
        </li>
    );
  });

  return (
      <section className="gallery page-block container">
        <div className={"gallery__header"}>
          <Paginator
            totalCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChanged={setCurrentPage}
            setPageLimit={setPageSize}
          />
          { (isAuth === ADMIN || isAuth === SUPER_ADMIN) &&
              <button
                  className={"btn btn--light-bg btn--sm add-btn"}
                  onClick={openEditGalleryForm}
              >
                  Add Tattoos
              </button>
          }
        </div>
        {  isFetching
            ? <Preloader />
            : totalCount && totalCount > 0
              ? (
                    <ul className="gallery__list list">
                      { GalleryItemsArray }
                    </ul>
                )
              : <NothingToShow/>
        }
        {  carouselData.isOpen &&
           <ImageFullView
              isOpen={carouselData.isOpen}
              gallery={gallery}
              activeIndex={carouselData.activeIndex}
              fakeApi={fakeApi}
              closeImg={()=>{setCarouselData({isOpen: false});}}
           />
        }
        <ModalPopUp
            isOpen={galleryItem || editGalleryMode}
            closeModal={closeGalleryItemEditModal}
            modalTitle={ galleryItem
                         ? 'Update tattoo styles for this image'
                         : `Update you gallery for ${activeStyle?.value}`
            }
        >
          {  galleryItem &&
              <UpdateGalleryItemForm
                  folder={'gallery'}
                  galleryItem={galleryItem}
                  styles={styles}
                  updateGalleryItem={updateItem}
                  closeModal={closeGalleryItemEditModal}
              />
          }
          {  editGalleryMode &&
              <GalleryUploadForm
                  isEditPortfolio={true}
                  updatePortfolio={updateGallery}
                  closeModal={closeEditGalleryForm}
              />
          }
        </ModalPopUp>
        <ModalPopUp
            isOpen={confirmationData.needConfirmation || confirmationForArchivingData.needConfirmation}
            modalTitle={''}
            closeModal={closeConfirmationModalCallBack}
        >
          { confirmationData.needConfirmation &&
              <Confirmation
                  content={'Are you sure? You about to delete this gallery image FOREVER...'}
                  confirm={() => {remove(confirmationData.itemId)}}
                  cancel={closeConfirmationModalCallBack}
              />
          }
          { confirmationForArchivingData.needConfirmation &&
              <Confirmation
                  content={'Are you sure? You about to move this gallery image to archive.'}
                  confirm={() => {archive(confirmationForArchivingData.itemId)}}
                  cancel={closeConfirmationModalCallBack}
              />
          }
        </ModalPopUp>
        <Tooltip id="my-tooltip" />
      </section>
  )
})