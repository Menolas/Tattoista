import * as React from "react";
import {Field, Form, Formik, FormikHelpers} from "formik";
import { GalleryItemType, StyleType} from "../../types/Types";
import {FieldWrapper} from "./formComponents/FieldWrapper";
import {API_URL} from "../../http";
import {useDispatch} from "react-redux";
import {updateGalleryItem} from "../../redux/Gallery/gallery-reducer";
import {ApiErrorMessage} from "./formComponents/ApiErrorMessage";

type InitialValuesType = {
    [key: string]: boolean;
};

type PropsType = {
    apiError: null | string;
    activeStyleId: string;
    folder: string;
    galleryItem: GalleryItemType;
    styles: Array<StyleType>;
    closeModal: () => void;
};

export const UpdateGalleryItemForm: React.FC<PropsType> = React.memo(({
    apiError,
    activeStyleId,
    folder,
    galleryItem,
    styles,
    closeModal
}) => {

    console.log('galleryItem.tattooStyles as string:', JSON.stringify(galleryItem.tattooStyles, null, 2));
    console.log('styles as string:', JSON.stringify(styles, null, 2));
    const dispatch = useDispatch();

    const submit = async (values: InitialValuesType, formikHelpers: FormikHelpers<InitialValuesType>) => {
        const { setSubmitting } = formikHelpers;
        let success = await dispatch(updateGalleryItem(galleryItem._id, values, activeStyleId));
        if (success) closeModal();
        setSubmitting(false);
    };

    const initialValues: InitialValuesType = {};
    styles.forEach((style) => {
        initialValues[style._id] = galleryItem?.tattooStyles?.includes(style._id);
    });

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={submit}
        >
            {(propsF) => {
                const {isSubmitting} = propsF;

                const tattooStyles = styles.map((style) => {
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
                });

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
                        { !!apiError &&
                            <ApiErrorMessage message={apiError}/>
                        }
                        <button
                            type="submit"
                            disabled={!propsF.dirty || isSubmitting}
                            className="btn btn--bg btn--dark-bg form__submit-btn"
                        >
                            {isSubmitting
                                ? 'Please wait...'
                                : 'Update Gallery Item Styles'
                            }
                        </button>
                    </Form>
                );
            }}
        </Formik>
    );
});

UpdateGalleryItemForm.displayName = 'UpdateGalleryItemForm';
