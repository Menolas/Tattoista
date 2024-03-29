import {API_URL} from "../../http"
import * as React from "react"
import AliceCarousel from "react-alice-carousel";
import {GalleryItemType} from "../../types/Types";

type PropsType = {
    gallery: Array<GalleryItemType>
    activeIndex: number
    fakeApi?: boolean
    imgUrl: string
    imgAlt: string
    closeImg: () => void
}

const responsive = {
    0: { items: 1 },
    600: { items: 1 },
    900: { items: 1 },
    1400: { items: 1 },
}

export const ImageFullView: React.FC<PropsType> = ({
    gallery,
    activeIndex,
    fakeApi,
    imgUrl,
    imgAlt,
    closeImg
}) => {

    const sliders = gallery.map(item => {
        const GalleryImgUrl = fakeApi
            ? `./uploads/gallery/${item.fileName}`
            : `${API_URL}/gallery/${item.fileName}`
        return (
            <div
                className={"image-full-view__img slider"}
                style={{backgroundImage: `url(${GalleryImgUrl})`}}
            >

            </div>
        )
    })
    return (
        <div className="image-full-view gallery__large-wrap modal-wrap">
            <button
                className="closing-btn image-full-view__closing-btn gallery__item-close-btn"
                onClick={() => { closeImg() }}
            >
                <span>{''}</span>
            </button>
            <div className="image-full-view__inner-wrap gallery__large">
                <AliceCarousel
                    items={sliders}
                    activeIndex={activeIndex}
                    responsive={responsive}
                    controlsStrategy={"default"}
                    mouseTracking
                    disableDotsControls={true}
                />
                {/*<img*/}
                {/*    className={"image-full-view__img"}*/}
                {/*    src={ fakeApi ? `./uploads/gallery/${imgUrl}` : `${API_URL}/gallery/${imgUrl}`} alt={imgAlt}*/}
                {/*    contextMenu={`alert("You can't download this picture.");return false;`}*/}
                {/*/>*/}
            </div>
        </div>
    )
}
