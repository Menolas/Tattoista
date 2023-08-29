import * as React from 'react'
import Sprite from '../assets/svg/sprite.svg'

export const SocialNav: React.FC = React.memo(() => {
  return (
    <nav className="social-nav">
      <ul className="social-nav__list">
        <li className="social-nav__item">
          <a className="social-nav__link" href="https://www.instagram.com/adelainehobf/" target={"_blank"}>
            <span><svg><use href={`${Sprite}#instagram`}/></svg></span>
            Instagram
          </a>
        </li>
        <li className="social-nav__item">
          <a className="social-nav__link" href="https://www.facebook.com/a.hobf" target={"_blank"}>
            <span><svg><use href={`${Sprite}#facebook`}/></svg></span>
            Messenger
          </a>
        </li>
        <li className="social-nav__item">
          <a className="social-nav__link" href="tel:+4745519015" target={"_blank"}>
            <span><svg><use href={`${Sprite}#phone`}/></svg></span>
            Facebook
          </a>
        </li>
      </ul>
    </nav>
  )
})
