import * as React from "react"
import { useState } from "react"
import { NavLink } from "react-router-dom"
import { HashLink } from "react-router-hash-link"
import {ADMIN, mainNavHashLinksData, socialLinksData, SUPER_ADMIN} from "../utils/constants"
// @ts-ignore
import Sprite from "../assets/svg/sprite.svg"

export const MobileMainMenu = ({
    isAuth,
    logout
}: {
    isAuth: string
    logout: () => void
}) => {

    const hashMobileMenuItems = mainNavHashLinksData.map(item => {
        return (
            <li className={'mobile-main-menu__item'}>
                <HashLink to={item.url}>
                    {item.text}
                </HashLink>
            </li>
        )
    })

    const socialMobileMenuItems = socialLinksData.map(item => {
        return (
            <li className={'mobile-main-menu__item'}>
                <NavLink
                    to={item.url}
                    target={"_blank"}>
                    <span><svg><use href={`${Sprite}#${item.icon}`}/></svg></span>
                    {item.text}
                </NavLink>
            </li>
        )
    })

    return (
        <nav className={'mobile-main-menu'}>
            <ul className={'list mobile-main-menu__list'}>
                <li className="mobile-main-menu__item">
                    <NavLink
                        to={`portfolio`}
                        className="main-nav__link"
                        //onClick={ closeMenu }
                    >
                        Portfolio
                    </NavLink>
                </li>
                { hashMobileMenuItems }
                { socialMobileMenuItems }
                { (isAuth === ADMIN || isAuth === SUPER_ADMIN) &&
                    <li className={'mobile-main-menu__item'}>
                        <NavLink
                            to="/admin/bookedConsultations"
                            className="main-header__admin-link"
                        >
                            <svg>
                                <use href={`${Sprite}#admin`}/>
                            </svg>
                            Admin page
                        </NavLink>
                    </li>
                }
                { isAuth
                    ? (
                        <li className={'mobile-main-menu__item'}>
                            <NavLink
                                to="/" className="main-header__admin-link"
                                onClick={logout}
                            >
                                <svg>
                                    <use href={`${Sprite}#logout`}/>
                                </svg>
                                Log out
                            </NavLink>
                        </li>
                    )
                    : (
                        <li className={'mobile-main-menu__item'}>
                            <NavLink
                                to="/login"
                                className="main-header__admin-link">
                                <svg><use href={`${Sprite}#login`}/></svg>
                                Log in
                            </NavLink>
                        </li>
                    )
                }
            </ul>
        </nav>
    )
}