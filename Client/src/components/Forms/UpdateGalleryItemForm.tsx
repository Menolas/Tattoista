import * as React from 'react'
import {Field, Form, Formik} from 'formik'
import { GalleryItemType, TattooStyleType} from "../../types/Types"
import {FieldWrapper} from "./FieldWrapper"
import {SERVER_URL} from "../../utils/constants"

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

    const handleChange = (input: string) => {
        //console.log(options)
    }

    const submit = (values: any) => {
        console.log(values)
        updateGalleryItem(galleryItem._id, values)
        closeModal()
    }

    let initialValues = {}
    styles.forEach((style) => {
        initialValues[style._id] = galleryItem.tattooStyles.includes(style._id)
    })
    console.log(initialValues)

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={submit}
        >
            {(propsF) => {
                let {isSubmitting} = propsF

                const tattooStyles = styles.map((style) => {
                    //const result = styles.find(({_id}) => _id === item)
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
                                //value={propsF.values.concent}
                                onChange={propsF.handleChange}
                            />
                            <label htmlFor={style._id}>
                                <span className="checkbox">{''}</span>
                                {style.value}
                            </label>

                        </FieldWrapper>
                    )
                })

                return (
                    <Form
                        id={"updateGalleryItem"}
                        className={"form form--updateGalleryItem"}
                        >
                        <div
                            className={'galleryItem-illustration'}
                            style={{ backgroundImage: `url(${SERVER_URL}${folder}/${galleryItem.fileName})` }}
                        >

                        </div>
                        {tattooStyles}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn--bg btn--transparent form__submit-btn"
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
