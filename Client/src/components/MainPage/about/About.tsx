import * as React from "react"
import {useState} from "react"
import {BookConsultationFormValues, PageType} from "../../../types/Types"
// @ts-ignore
import Sprite from "../../../assets/svg/sprite.svg"
import {API_URL} from "../../../http"
import {ModalPopUp} from "../../common/ModalPopUp"
import { UpdateAboutPageFormFormik } from "../../Forms/UpdateAboutPageFormFormik"
import {Tooltip} from "react-tooltip"
import {ADMIN, SUPER_ADMIN} from "../../../utils/constants"
import {SocialNav} from "../../SocialNav";
import {BookingButton} from "../../common/BookingButton"
import {ReadMore} from "../../common/ReadMore";
import {Preloader} from "../../common/Preloader";

type PropsType = {
    isFetching: boolean;
    fakeApi: boolean;
    isAuth: string;
    pageAbout?: PageType;
    edit: (values: FormData) => void;
    changeVisibility: (isActive: boolean) => void;
}

export const About: React.FC<PropsType> = React.memo(({
     isFetching,
     fakeApi,
     isAuth,
     pageAbout,
     edit,
     changeVisibility,
}) => {

    const [isEditMode, setIsEditMode] = useState(false)

    const closeEditModal = () => {
        setIsEditMode(false)
    }

    const editModalTitle = 'Update "about" block'

    const imgUrl = fakeApi
        ? `url("./uploads/avatars/avatar.jpg")`
        : pageAbout?.wallPaper ? `url("${API_URL}/pageWallpapers/${pageAbout._id}/${pageAbout.wallPaper}")` : `url("./uploads/avatars/avatar.jpg")`

    return (
        <section className="page-block about container" id="about">
            { (isAuth === ADMIN || isAuth === SUPER_ADMIN) &&
                <div className={"actionBar"}>
                    <button
                        data-tooltip-id="about-tooltip"
                        data-tooltip-content={
                            pageAbout?.isActive
                            ? 'Hide "about me" block'
                            : 'Show "about me" block'
                        }
                        className={"btn btn--icon"}
                        onClick={() => {
                            changeVisibility(pageAbout.isActive)
                        }}
                    >
                        {pageAbout?.isActive
                                ? <svg><use href={`${Sprite}#hide`}/></svg>
                                : <svg><use href={`${Sprite}#eye`}/></svg>
                        }
                    </button>
                    <button
                        data-tooltip-id="about-tooltip"
                        data-tooltip-content='Edit "about me" block'
                        className={"btn btn--icon"}
                        onClick={() => setIsEditMode(true)}
                    >
                        <svg><use href={`${Sprite}#edit`}/></svg>
                    </button>
                </div>
            }
            {
                isFetching
                    ? (
                        <>
                            <h2 className={'page-block__title'}>{pageAbout?.title ? pageAbout.title : 'Tattoo Artist'}</h2>
                            <div className={'about__layout-wrap'}>
                                <div className={'about__img-wrap-decor'}>
                                    <div
                                        className={'about__img-wrap'}
                                        style={{backgroundImage: imgUrl}}
                                    >{''}</div>
                                </div>
                                <div className={'about__content-wrap'}>
                                    <h3 className={'page-block__title-secondary'}>Facts about me</h3>
                                    <div className={'about__content'}>
                                        {
                                            pageAbout?.content &&
                                            <ReadMore id={'text-about'} text={pageAbout?.content} amountOfWords={36} />
                                        }
                                    </div>
                                    <div className={'about__add-block'}>
                                        <h3 className={'page-block__title-secondary'}>Follow me</h3>
                                        <SocialNav />
                                        <BookingButton
                                            consentId={"consent2"}
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                      )
                    : <Preloader />
            }
            <ModalPopUp
                isOpen={isEditMode}
                modalTitle={editModalTitle}
                closeModal={closeEditModal}
            >
                {
                    isEditMode &&
                    <UpdateAboutPageFormFormik
                        pageAbout={pageAbout}
                        edit={edit}
                        closeModal={closeEditModal}
                    />
                }
            </ModalPopUp>
            <Tooltip id="about-tooltip" />
        </section>
    )
})
