import * as React from "react";
import { useState } from "react";
import {Field, Form, Formik, FormikHelpers, FormikValues} from "formik";
import {
  isFileSizeValid,
  isFileTypesValid,
  MAX_FILE_SIZE,
  VALID_FILE_EXTENSIONS
} from "../../utils/validators";
import {RoleType, UpdateUserFormValues, UserType} from "../../types/Types";
import {API_URL} from "../../http";
// @ts-ignore
import avatar from "../../assets/img/fox.webp";
import {FieldComponent} from "./FieldComponent";
import * as Yup from "yup";
import {FieldWrapper} from "./FieldWrapper";

const getValidationSchema = (isEditing: boolean, hasNewFile: boolean) => {
  let schema = Yup.object().shape({
    displayName: Yup.string()
        .min(2, 'Name is too short - should be 2 chars minimum.')
        .required("First name is a required field"),
    email: Yup.string()
        .email("Email should have correct format")
        .when(['phone', 'insta', 'messenger', 'whatsapp'], {
          is: (phone, insta, messenger, whatsapp) =>
              !phone && !insta && !messenger && !whatsapp,
          then: () => Yup.string().required('At least one field must be filled'),
        }),
    password: Yup
        .string()
        .min(4, 'Password is too short - should be 4 chars minimum.'),
  });

  if (!isEditing || hasNewFile) {
    schema = schema.concat(Yup.object().shape({
      avatar: Yup.mixed()
          .test('fileSize', 'Max allowed size is 1024*1024', (value: File) => {
            if (!value) return true
            return isFileSizeValid([value], MAX_FILE_SIZE)
          })
          .test('fileType', 'Invalid file type', (value: File) => {
            if (!value) return true
            return isFileTypesValid([value], VALID_FILE_EXTENSIONS)
          }),
    }));
  }
  return schema;
}

type PropsType = {
  isEditing: boolean;
  roles: Array<RoleType>;
  profile?: UserType;
  closeModal: () => void;
  updateUser?: (clientId: string, values: FormData) => void;
  addUser?: (values: FormData) => void;
}

export const UpdateUserForm: React.FC<PropsType> = React.memo(({
  isEditing,
  roles,
  profile,
  closeModal,
  updateUser,
  addUser,
}) => {

  //console.log(JSON.stringify(profile) + " profile !!!!!!!!!!!!!!!!!!");

  const [hasNewFile, setHasNewFile] = useState(false);
  const validationSchema = getValidationSchema(isEditing, hasNewFile);
  const [imageURL, setImageURL] = useState('')

  const handleOnChange = (event) => {
    event.preventDefault()
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0]
      const fileReader = new FileReader()
      fileReader.onloadend = () => {
        // @ts-ignore
        setImageURL(fileReader.result)
      }
      setHasNewFile(true);
      fileReader.readAsDataURL(file)
    }
  }

  let rolesInitialValues = {};
  rolesInitialValues = roles.reduce((acc, role) => {
    const isSelected = isEditing ? profile.roles.some(profileRole => profileRole._id === role._id) : false;
    return {
        ...acc,
        [role._id]: isSelected,
    };
  }, {});


  const initialValues = {
    avatar: profile?.avatar ?? '',
    displayName: profile?.displayName ?? '',
    email: profile?.email ?? '',
    password: '',
    roles: rolesInitialValues
  }

  console.log(JSON.stringify(initialValues) + " initialValues!!!!!!!!!!");

  const submit = (values, actions: FormikHelpers<FormikValues>) => {
    const formData = new FormData();

    // Append each field from values to formData
    for (let key in values) {
      // If the field is 'roles', append each role ID and its boolean value directly
      if (key === 'roles') {
        let roles = "";
        const userRoles = values[key];
        for (let roleId in userRoles) {
          if (userRoles[roleId]) {
            roles = roles + roleId + ' '
          }
        }
        formData.append(key, roles);
      } else {
        formData.append(key, values[key]);
      }
    }

    // Log formData for debugging
    // for (let [key, value] of formData.entries()) {
    //   console.log(key, value);
    // }

    if (isEditing) {
      updateUser(profile._id, formData);
      //console.log(JSON.stringify(formData) + " formData !!!!!!!!!!");
    } else {
      addUser(formData);
      //console.log(JSON.stringify(formData) + " formData !!!!!!!!!!");
    }
    actions.resetForm();
    closeModal();
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={submit}
      context={{ isEditing: isEditing }}
      enableReinitialize={true}
    >
      {propsF => {

        const rolesFields = roles.map((role) => {
          return (
              <FieldWrapper
                  key={role._id}
                  wrapperClass={'form__input-wrap--checkbox'}
                  name={`roles.${role._id}`}
              >
                <Field
                    type="checkbox"
                    name={`roles.${role._id}`}
                    id={role._id}
                    //value={role._id}
                    checked={propsF.values.roles[role._id]}
                    onChange={(e) => {
                      propsF.setFieldValue(`roles.${role._id}`, e.target.checked);
                    }}
                />
                <label htmlFor={role._id}>
                  <span className="checkbox">{''}</span>
                  {role.value}
                </label>
              </FieldWrapper>
          )
        });

        return (
          <Form className="form" encType={"multipart/form-data"}>
            <FieldWrapper name={'avatar'} wrapperClass={'form__input-wrap--uploadFile'}>
              <div className="form__input-wrap--uploadFile-img">
                <img
                  src={imageURL
                      ? imageURL
                      : profile?.avatar
                          ? `${API_URL}/users/${profile._id}/avatar/${profile.avatar}`
                          : avatar
                  }
                  alt="preview"
                />
                <label className="btn btn--sm btn--dark-bg" htmlFor={"avatar"}>Pick File</label>
              </div>
              <Field
                  className="hidden"
                  id="avatar"
                  name={'avatar'}
                  type={'file'}
                  value={undefined}
                  onChange={(e) => {
                    propsF.setFieldValue('avatar', e.currentTarget.files[0]);
                    handleOnChange(e);
                  }}
              />
            </FieldWrapper>
            <FieldComponent
                name={'displayName'}
                type={'text'}
                placeholder={'Full Name'}
                onChange={propsF.handleChange}
                value={propsF.values.displayName}
            />
            <FieldComponent
                name={'email'}
                type={'text'}
                placeholder={'Email'}
                onChange={propsF.handleChange}
                value={propsF.values.email}
            />
            <FieldComponent
                name={'password'}
                type={'password'}
                placeholder={'xxxxxxxx'}
                label={'Password'}
                onChange={propsF.handleChange}
                value={propsF.values.password}
            />
            { rolesFields }
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
