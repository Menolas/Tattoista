import * as React from "react"
import {LoginForm} from "../../components/Forms/LoginFormFormik"
import {LoginFormValues} from "../../types/Types"

type PropsType = {
  isAuth: boolean
  loginError: string
  login: (values: LoginFormValues) => void
}

export const Login: React.FC<PropsType> = React.memo(({
  isAuth,
  loginError,
  login
}) => {

  return (
    <div className="login">
      <div className = "login__form-wrap">
        <LoginForm
          isAuth={isAuth}
          loginError={loginError}
          login={login}
        />
      </div>
    </div>
  )
})
