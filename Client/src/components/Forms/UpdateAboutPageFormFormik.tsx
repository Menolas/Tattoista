import * as React from "react";
import { useState } from "react";
import { Field, Form, Formik} from "formik";
import {API_URL} from "../../http";
import {PageType} from "../../types/Types";
import {FieldComponent} from "./FieldComponent";
import {FieldWrapper} from "./FieldWrapper";
import * as Yup from "yup";
import {isFileSizeValid, isFileTypesValid, MAX_FILE_SIZE, VALID_FILE_EXTENSIONS} from "../../utils/validators";

const tattooMachine = require("../../assets/img/tattoo-machine.webp") as string;

type PropsType = {
    pageAbout?: PageType
    editAboutPage: (values: FormData) => void
    closeModal: () => void
};

export const UpdateAboutPageFormFormik: React.FC<PropsType> =  React.memo(({
    pageAbout,
    editAboutPage,
    closeModal
}) => {

    const validationSchema = Yup.object().shape({
        // aboutPageWallPaper: Yup.mixed()
        //     .test('fileSize', 'Max allowed size is 1024*1024', (value: File) => {
        //         if (!value) return true;
        //         return isFileSizeValid([value], MAX_FILE_SIZE);
        //     })
        //     .test('fileType', 'Invalid file type', (value: File) => {
        //         if (!value) return true;
        //         return isFileTypesValid([value], VALID_FILE_EXTENSIONS);
        //     }),
        aboutPageTitle: Yup.string(),
        aboutPageContent: Yup.string(),
    });

    const validateFile = (file: File): boolean => {
        // Perform your file validation logic here
        // For example, check file size and file type
        const isValidSize = file.size <= MAX_FILE_SIZE;
        const isValidType = VALID_FILE_EXTENSIONS.includes(file.type);
        return isValidSize && isValidType;
    };

    const [imageURL, setImageURL] = useState('')

    const fileReader = new FileReader()
    fileReader.onloadend = () => {
        // @ts-ignore
        setImageURL(fileReader.result)
    }

    const handleOnChange = (event) => {
        event.preventDefault();
        if (event.target.files && event.target.files.length) {
            const file = event.target.files[0];
            fileReader.readAsDataURL(file);
        }
    }

    const initialValues = {
        aboutPageWallPaper: pageAbout && pageAbout.wallPaper ? pageAbout.wallPaper : '',
        aboutPageTitle: pageAbout && pageAbout.title ? pageAbout.title : '',
        aboutPageContent: pageAbout && pageAbout.content ? pageAbout.content : '',
    }

    const submit = (values, actions) => {
        // Check if aboutPageWallPaper is a File object
        if (values.aboutPageWallPaper instanceof File) {
            const isValidFile = validateFile(values.aboutPageWallPaper);
            if (!isValidFile) {
                actions.setFieldError('aboutPageWallPaper', 'Invalid file');
                return;
            }
        }

        const formData = new FormData();
        for (let value in values) {
            formData.append(value, values[value]);
        }
        editAboutPage(formData);
        closeModal();
    }

    console.log(`${API_URL}/pageWallpapers/${pageAbout?._id}/${pageAbout.wallPaper}`)

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={submit}
        >
            {propsF => {
                return (
                    <Form className="form form--updateAboutForm" encType={"multipart/form-data"}>
                        <div className="form__input-wrap form__input-wrap--uploadFile">
                            <div className={"form__input-wrap--uploadFile-img"}>
                                <img
                                    src={
                                        imageURL ? imageURL
                                            : pageAbout?.wallPaper
                                            ? `${API_URL}/pageWallpapers/${pageAbout?._id}/${pageAbout.wallPaper}`
                                            : tattooMachine
                                    }
                                    alt="preview"
                                />
                            </div>
                            <label className="btn btn--sm" htmlFor={"aboutPageWallPaper"}>Pick File</label>
                            <FieldWrapper name={'aboutPageWallPaper'}>
                                <Field
                                    className="hidden"
                                    id="aboutPageWallPaper"
                                    name={'aboutPageWallPaper'}
                                    type={'file'}
                                    accept='image/*,.png,.jpg,.web,.jpeg'
                                    value={undefined}
                                    onChange={(e) => {
                                        propsF.setFieldValue('aboutPageWallPaper', e.currentTarget.files[0])
                                        handleOnChange(e)
                                    }}
                                />
                            </FieldWrapper>
                        </div>

                        <FieldComponent
                            name={'aboutPageTitle'}
                            type={'text'}
                            placeholder={"Block Title"}
                            value={propsF.values.aboutPageTitle}
                            onChange={propsF.handleChange}
                        />

                        <FieldWrapper
                            name={"aboutPageContent"}
                        >
                            <Field
                                name={'aboutPageContent'}
                                component="textarea"
                                rows={6}
                                placeholder={'Describe this Tattoo style'}
                                onChange={propsF.handleChange}
                                value={propsF.values.aboutPageContent}/>
                        </FieldWrapper>

                        <button
                            type="submit"
                            disabled={propsF.isSubmitting}
                            className="btn btn--bg btn--transparent form__submit-btn">
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
