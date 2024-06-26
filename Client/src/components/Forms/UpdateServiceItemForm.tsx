import * as React from "react";
import {useState} from "react";
import {Field, Form, Formik, FormikHelpers, FormikValues} from "formik";
import * as Yup from "yup";
import {API_URL} from "../../http";
import {ServiceType} from "../../types/Types";
import {FieldComponent} from "./formComponents/FieldComponent";
import {FieldWrapper} from "./formComponents/FieldWrapper";
import {ApiErrorMessage} from "./formComponents/ApiErrorMessage";
import {
    validateFile
} from "../../utils/validators";
import {useDispatch} from "react-redux";
import {
    addService,
    editService,
} from "../../redux/Services/services-reducer";

const validationSchema = Yup.object().shape({
    title: Yup.string()
        .required("Name is a required field"),
    condition_0: Yup.string(),
    condition_1: Yup.string(),
    condition_2: Yup.string(),
    condition_3: Yup.string(),
    condition_4: Yup.string(),
    condition_5: Yup.string(),
});

type PropsType = {
    apiError: null | string;
    service?: ServiceType;
    closeModal: () => void;
}
export const UpdateServiceItemForm: React.FC<PropsType> = React.memo(({
    apiError,
    service,
    closeModal,
}) => {

    const [imageURL, setImageURL] = useState('');

    const dispatch = useDispatch();

    const fileReader = new FileReader();
    fileReader.onloadend = () => {
        // @ts-ignore
        setImageURL(fileReader.result);
    }

    const handleOnChange = (event) => {
        event.preventDefault();
        if (event.target.files && event.target.files.length) {
            const file = event.target.files[0];
            fileReader.readAsDataURL(file);
        }
    }

    const initialValues = {
        wallPaper: service?.wallPaper ?? '',
        title: service?.title ?? '',
        condition_0: service?.conditions[0] ?? '',
        condition_1: service?.conditions[1] ?? '',
        condition_2: service?.conditions[2] ?? '',
        condition_3: service?.conditions[3] ?? '',
        condition_4: service?.conditions[4] ?? '',
        condition_5: service?.conditions[5] ?? '',
    }

    const submit = async (values, actions: FormikHelpers<FormikValues>) => {
        // Check if picture is a File object
        if (values.wallPaper instanceof File) {
            const isValidFile = validateFile(values.wallPaper);
            if (!isValidFile) {
                actions.setFieldError('wallPaper', 'Invalid file');
                return;
            } else {
                actions.setFieldValue('wallpaper', '');
            }
        }
        const formData = new FormData();
        for (let value in values) {
            formData.append(value, values[value]);
        }
        let success;
        try {
            if (service) {
                success = await dispatch(editService(service._id, formData));
            } else {
                success = await dispatch(addService(formData));
            }
            if (success) {
                closeModal();
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
        actions.setSubmitting(false);
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={submit}
        >
            {propsF => {

                return (
                    <Form className="form form--updateService" encType={"multipart/form-data"}>
                        <FieldWrapper name={'wallPaper'} wrapperClass={'form__input-wrap--uploadFile'}>
                            <div className={"form__input-wrap--uploadFile-img"}>
                                <img
                                    src={
                                        imageURL ? imageURL
                                            : service?.wallPaper
                                            ? `${API_URL}/serviceWallpapers/${service._id}/${service.wallPaper}`
                                            : "./uploads/ServicesWallpapers/service.jpg"
                                    }
                                    alt="preview"
                                />
                                <label className="btn btn--sm btn--dark-bg" htmlFor={"wallPaper"}>
                                    Pick File
                                </label>
                            </div>
                            <Field
                                className="hidden"
                                id="wallPaper"
                                name={'wallPaper'}
                                type={'file'}
                                accept='image/*,.png,.jpg,.web,.jpeg'
                                value={undefined}
                                onChange={(e) => {
                                    propsF.setFieldValue('wallPaper', e.currentTarget.files[0])
                                    handleOnChange(e)
                                }}
                            />
                        </FieldWrapper>
                        <FieldComponent
                            name={'title'}
                            type={'text'}
                            placeholder={"Service Title"}
                            value={propsF.values.title}
                            onChange={propsF.handleChange}
                        />

                        <FieldComponent
                            name={'condition_0'}
                            type={'text'}
                            placeholder={"Service condition"}
                            value={propsF.values.condition_0}
                            onChange={propsF.handleChange}
                        />

                        <FieldComponent
                            name={'condition_1'}
                            type={'text'}
                            placeholder={"Service condition"}
                            value={propsF.values.condition_1}
                            onChange={propsF.handleChange}
                        />

                        <FieldComponent
                            name={'condition_2'}
                            type={'text'}
                            placeholder={"Service condition"}
                            value={propsF.values.condition_2}
                            onChange={propsF.handleChange}
                        />

                        <FieldComponent
                            name={'condition_3'}
                            type={'text'}
                            placeholder={"Service condition"}
                            value={propsF.values.condition_3}
                            onChange={propsF.handleChange}
                        />

                        <FieldComponent
                            name={'condition_4'}
                            type={'text'}
                            placeholder={"Service condition"}
                            value={propsF.values.condition_4}
                            onChange={propsF.handleChange}
                        />

                        <FieldComponent
                            name={'condition_5'}
                            type={'text'}
                            placeholder={"Service condition"}
                            value={propsF.values.condition_5}
                            onChange={propsF.handleChange}
                        />
                        { !!apiError &&
                            <ApiErrorMessage message={apiError}/>
                        }
                        <button
                            type="submit"
                            disabled={!propsF.dirty || propsF.isSubmitting}
                            className="btn btn--bg btn--dark-bg form__submit-btn">
                            {propsF.isSubmitting
                                ? 'Please wait...'
                                : 'SUBMIT'
                            }
                        </button>

                    </Form>
                )
            }}
        </Formik>
    )
});
