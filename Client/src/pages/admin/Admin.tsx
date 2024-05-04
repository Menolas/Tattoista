import * as React from "react";
import {Navigate, NavLink} from "react-router-dom";
import { Outlet } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
    getAuthSelector,
    getUserSelector
} from "../../redux/Auth/auth-selectors";
import {ADMIN, ADMIN_BUTTONS_DATA, SUPER_ADMIN} from "../../utils/constants";
// @ts-ignore
import Sprite from "../../assets/svg/sprite.svg";
import {useEffect, useState} from "react";
import {ApiErrorMessage} from "../../components/common/ApiErrorMessage";
import {SuccessPopUp} from "../../components/common/SuccessPopUp";
import {
    getApiErrorSelector,
    getSuccessModalSelector
} from "../../redux/General/general-selectors";
import {setApiErrorAC, setSuccessModalAC} from "../../redux/General/general-reducer";

export const Admin: React.FC = React.memo(() => {

  const apiError = useSelector(getApiErrorSelector);
  const successModal = useSelector(getSuccessModalSelector);
  const isAuth = useSelector(getAuthSelector);
  const user = useSelector(getUserSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    if (successModal.isSuccess) {
        setTimeout( () => {
            setSuccessModalCallBack();
        }, 3000);
    }
  }, [successModal]);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const setApiErrorCallBack = () => {
    dispatch(setApiErrorAC(''));
  }

  const setSuccessModalCallBack = () => {
    dispatch(setSuccessModalAC(false, ''));
  }

  if (!isAuth) return <Navigate to='/login' />
  if (isAuth && user.isActivated !== true) {
    return <Navigate to="/registration" />
  }

  const AdminButton = ({
    btn
  }: {
      btn: {
          btnText: string
          btnUrl: string
          subMenu?: any
      }
  }) => {
      return (
        <li key={btn.btnText}>
            <NavLink
                to={btn.btnUrl}
                onClick={() => {
                   setIsMobileMenuOpen(false)
                }}
            >
                {btn.btnText}
            </NavLink>
            {
                btn.subMenu &&
                <ul className={"subMenu list"}>
                    {
                        btn.subMenu.map(subMenuItem => {
                            return (
                                <li key={subMenuItem.btnUrl}>
                                    <NavLink
                                        to={subMenuItem.btnUrl}
                                        onClick={() => {
                                            setIsMobileMenuOpen(false)
                                        }}
                                    >
                                        {subMenuItem.btnText}
                                    </NavLink>
                                </li>
                            )

                        })
                    }
                </ul>
            }
        </li>
      )
  }

  const adminButtons = ADMIN_BUTTONS_DATA.map((btn, i ) => {
    if (isAuth === "ADMIN") {
        if (btn.btnText !== "Users") {
            return <AdminButton btn={btn} key={`${btn.btnText}-${i}`}/>
        }
    }
    if (isAuth === "SUPER_ADMIN") {
      return <AdminButton btn={btn} key={`${btn.btnText}-${i}`}/>
    }
    return null
  });

  return (
    <div className="admin page-block page-block--top container">
      <button
        className={"btn btn--bg btn--light-bg btn--icon--light admin__left-panel-btn"}
        onClick={() => {
            setIsMobileMenuOpen(true);
        }}
      >
        <svg><use href={`${Sprite}#admin`} /></svg>
      </button>
      <aside className={ isMobileMenuOpen ? "admin__left-panel show" : "admin__left-panel"}>
        <nav className={'admin__nav'}>
            <button
               className={"btn btn--transparent closing-btn"}
               onClick={() => {
                   setIsMobileMenuOpen(false);
               }}
            >
                <span>{''}</span>
            </button>
            <ul className="list admin__view-btns admin__nav-list">
                {adminButtons}
            </ul>
        </nav>
      </aside>
      <section className={'admin__content'}>
          <Outlet />
      </section>
      <ApiErrorMessage
            isOpen={!!apiError}
            error={apiError}
            closeModal={setApiErrorCallBack}
      />
      <SuccessPopUp
            isOpen={successModal.isSuccess}
            closeModal={setSuccessModalCallBack}
            content={successModal.successText}
      />
    </div>
  )
});
