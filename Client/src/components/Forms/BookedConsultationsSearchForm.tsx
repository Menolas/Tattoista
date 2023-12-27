import * as React from "react"
import {Field, Form, Formik} from "formik"
import {BookedConsultationsFilterType} from "../../redux/bookedConsultations/bookedConsultations-reducer"
// @ts-ignore
import Sprite from "../../assets/svg/sprite.svg"

type FormType = {
  term: string
  status: string
}

const bookedConsultationsSearchFormValidate = (values: FormType) => {
  return {}
}

type PropsType = {
  filter: BookedConsultationsFilterType
  onFilterChanged: (filter: BookedConsultationsFilterType) => void
}

export const BookedConsultationsSearchForm: React.FC<PropsType> = React.memo(({
  filter,
  onFilterChanged
}) => {
  const submit = (values: FormType, {setSubmitting}: { setSubmitting: (isSubmitting: boolean) => void }) => {
    const filter: BookedConsultationsFilterType = {
      term: values.term,
      status: values.status
    }
    onFilterChanged(filter)
    setSubmitting(false)
  }
  const initialValues = {
    term: filter.term,
    status: filter.status
  }
  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validate={bookedConsultationsSearchFormValidate}
      onSubmit={submit}
    >
      {
        (propsF) => {
          let {isSubmitting} = propsF
          return (
            <Form
              className={"form search-form"}
            >
              <Field
                className={"search-input"}
                type="text"
                name="term"
                placeholder={"Search..."}
              />

              <Field name="status" as="select">
                <option value="null">All</option>
                <option value="true">Only contacted</option>
                <option value="false">Only not contacted</option>
              </Field>
              <button
                className={"btn btn--sm btn--light-bg search-submit"}
                type="submit" disabled={isSubmitting}
              >
                <svg><use href={`${Sprite}#search`}/></svg>
              </button>
            </Form>
          )
        }
      }
    </Formik>
  )
})
