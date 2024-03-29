import * as React from "react"
import {Field, Form, Formik} from "formik"
import { GalleryItemType, TattooStyleType} from "../../types/Types"
import {FieldWrapper} from "./FieldWrapper"
import {API_URL} from "../../http"

type PropsType = {
    folder: string
    galleryItem: GalleryItemType
    styles: Array<TattooStyleType>
    updateGalleryItem: (id: string, values: object) => void
    closeModal?: () => void
}

export const UpdateGalleryItemForm: React.FC<PropsType> = ({
    folder,
    galleryItem,
    styles,
    updateGalleryItem,
    closeModal
}) => {

    const submit = (values: any) => {
        updateGalleryItem(galleryItem._id, values)
        closeModal()
    }

    let initialValues = {}
    styles.forEach((style) => {
        if (!style.nonStyle) {
            initialValues[style._id] = galleryItem?.tattooStyles?.includes(style._id)
        }
    })

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={submit}
        >
            {(propsF) => {
                let {isSubmitting} = propsF

                const tattooStyles = styles.map((style) => {
                    if (!style.nonStyle) {
                        return (
                            <FieldWrapper
                                key={style._id}
                                wrapperClass={'form__input-wrap--checkbox'}
                                name={style._id}
                            >
                                <Field
                                    type="checkbox"
                                    name={style._id}
                                    id={style._id}
                                    onChange={propsF.handleChange}
                                />
                                <label htmlFor={style._id}>
                                    <span className="checkbox">{''}</span>
                                    {style.value}
                                </label>

                            </FieldWrapper>
                        )
                    }
                })

                return (
                    <Form
                        id={"updateGalleryItem"}
                        className={"form form--updateGalleryItem"}
                        >
                        <div
                            className={'galleryItem-illustration'}
                            style={{ backgroundImage: `url(${API_URL}/${folder}/${galleryItem?.fileName})` }}
                        >

                        </div>
                        {tattooStyles}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn--bg btn--dark-bg form__submit-btn"
                        >
                            {isSubmitting
                                ? 'Please wait...'
                                : 'Update Gallery Item Styles'
                            }
                        </button>
                    </Form>
                )

            }}
        </Formik>
    )
}
