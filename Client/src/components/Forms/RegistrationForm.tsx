import * as React from "react";
import { Field, Form, Formik, FormikHelpers, FormikValues } from "formik";
// @ts-ignore
import {
  isFileSizeValid,
  MAX_FILE_SIZE,
  isFileTypesValid, VALID_FILE_EXTENSIONS
} from "../../utils/validators";
import * as Yup from "yup";
import {RegistrationFormValues} from "../../types/Types";
import {FieldComponent} from "./formComponents/FieldComponent";
import {FieldWrapper} from "./formComponents/FieldWrapper";
import {ApiErrorMessage} from "./formComponents/ApiErrorMessage";
import {useState} from "react";
// @ts-ignore
import avatar from "../../assets/img/fox.webp";
import {useDispatch} from "react-redux";
import {registration} from "../../redux/Auth/auth-reducer";

const validationSchema = Yup.object().shape({
  avatar: Yup.mixed()
      .test('fileSize', 'Max allowed size is 1024*1024', (value: File) => {
        if (!value) return true
        return isFileSizeValid([value], MAX_FILE_SIZE);
      })
      .test('fileType', 'Invalid file type', (value: File) => {
        if (!value) return true
        return isFileTypesValid([value], VALID_FILE_EXTENSIONS);
      }),
  displayName: Yup
      .string()
      .min(2, 'Display is too short - should be 4 chars minimum.')
      .required('Required field'),
  email: Yup
      .string()
      .email("Invalid email format")
      .required('Required field'),
  password: Yup
      .string()
      .min(4, 'Password is too short - should be 4 chars minimum.')
      .required('Required field'),
  consent: Yup
      .boolean()
      .oneOf([true],'If you want to be registered as an admin you need to check this and agree to sare your email with us')
      .required('Required field')
});

type PropsType = {
  authApiError: string | null;
}

export const RegistrationForm: React.FC<PropsType> = React.memo(({
  authApiError,
}) => {

  const dispatch = useDispatch();

  const [imageURL, setImageURL] = useState('');

  const handleOnChange = (event) => {
    event.preventDefault();
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        // @ts-ignore
        setImageURL(fileReader.result);
      }
      fileReader.readAsDataURL(file);
    }
  }

  const submit = async (
      values: RegistrationFormValues,
      actions: FormikHelpers<FormikValues>
  ) => {
    await dispatch(registration(values));
    actions.setSubmitting(false);
  };

  const initialValues: RegistrationFormValues = {
    avatar: '',
    displayName: '',
    email: '',
    password: '',
    consent: false,
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={submit}
    >
      {(propsF) => {

        return (
          <Form id="registration" className="form">
            <h3 className="form__title">Registration</h3>
            <FieldWrapper
                name={'avatar'}
                wrapperClass={'form__input-wrap--uploadFile'}
            >
                <div className="form__avatar">
                  <img
                      src={ imageURL ? imageURL :  avatar }
                      alt="preview"
                  />
                </div>
                <label className="btn btn--sm btn--dark-bg" htmlFor={"avatar"}>Pick File</label>

                <Field
                    className="hidden"
                    id="avatar"
                    name={'avatar'}
                    type={'file'}
                    value={undefined}
                    onChange={(e) => {
                      propsF.setFieldValue('avatar', e.currentTarget.files[0])
                      handleOnChange(e)
                    }}
                />
            </FieldWrapper>
            <FieldComponent
                name={'displayName'}
                type={'text'}
                placeholder={'Your display name'}
                value={propsF.values.displayName}
                onChange={propsF.handleChange}
            />
            <FieldComponent
                name={'email'}
                type={'text'}
                placeholder={'Your email'}
                value={propsF.values.email}
                onChange={propsF.handleChange}
            />
            <FieldComponent
                name={'password'}
                type={'password'}
                placeholder={'Password'}
                value={propsF.values.password}
                onChange={propsF.handleChange}
            />
            <FieldWrapper
                wrapperClass={'form__input-wrap--checkbox'}
                name={"consent"}
            >
              <Field
                  type="checkbox"
                  name="consent"
                  id="consent"
              />
              <label htmlFor="consent">
                <span className="checkbox">{''}</span>
                CONSENT WITH PROCESSING OF MY PERSONAL DATA
              </label>
            </FieldWrapper>
            { authApiError &&
                <ApiErrorMessage message={authApiError}/>
            }
            <button
              className="btn btn--bg btn--dark-bg form__submit-btn"
              type="submit"
              disabled={!propsF.dirty || propsF.isSubmitting}
            >
              {propsF.isSubmitting
                  ? 'Please wait...'
                  : 'Sign Up'
              }
            </button>
          </Form>
        )
      }}
    </Formik>
  )
});
