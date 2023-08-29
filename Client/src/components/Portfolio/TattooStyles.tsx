import * as React from 'react'
import {useState} from 'react'
import classNames from 'classnames'
import AliceCarousel from 'react-alice-carousel'
import 'react-alice-carousel/lib/alice-carousel.css'
import {TattooStyleType} from '../../types/Types'
import Sprite from '../../assets/svg/sprite.svg'
import {UpdateTattooStyleFormFormik} from '../Forms/UpdateTattooStyleFormFormik'
import {ModalPopUp} from '../common/ModalPopUp'
import {SuccessModal} from "../SuccessModal";

const responsive = {
  0: {items: 3},
  600: {items: 3},
  900: {items: 4},
  1400: {items: 6},
}

type PropsType = {
  isAuth: boolean
  tattooStyles: Array<TattooStyleType>,
  activeStyle: TattooStyleType,
  resetActiveStyle: (style: TattooStyleType) => void
  addTattooStyle: (values: FormData) => void
  editTattooStyle: (id: string, values: FormData) => void
  deleteTattooStyle: (id: string) => void
}

export const TattooStyles: React.FC<PropsType> = React.memo(({
  isAuth,
  tattooStyles,
  activeStyle,
  resetActiveStyle,
  addTattooStyle,
  editTattooStyle,
  deleteTattooStyle
}) => {
  const [addTattooStyleMode, setAddTattooStyleMode] = useState(false)
  const [editTattooStyleMode, setEditTattooStyleMode] = useState(false)
  const [isSuccess, setSuccess] = useState(false)
  const successModalTitle = ''
  const modalTitle = 'Add a Tattoo Style'

  const showSuccessModal = () => {
        setSuccess(true)
  }

  const closeSuccessModal = () => {
        setSuccess(false)
  }

  const closeModal = () => {
    setAddTattooStyleMode(false)
  }

  const closeEditModal = () => {
      setEditTattooStyleMode(false)
  }

  const tattooStylesAliceArray = tattooStyles
    ?.map((item) => {
      let itemClasses = "tattoo-style__item"
      if (activeStyle) {
        itemClasses = classNames('tattoo-style__item', {'active': activeStyle._id === item._id})
      }

      return (
        <div
          className={itemClasses}
          onClick={() => {resetActiveStyle(item)}}
        >
          {item.value}
        </div>
      )
    })

  return (
    <section className="tattoo-style page-block">
      { isAuth &&
        <button
            className={"btn btn--sm btn--light-bg"}
            onClick={() => {setAddTattooStyleMode(true)}}
        >
            Add a Tattoo Style
        </button>
      }
      {
        addTattooStyleMode &&
          <ModalPopUp
              modalTitle={modalTitle}
              closeModal={closeModal}
          >
              <UpdateTattooStyleFormFormik
                  addTattooStyle={addTattooStyle}
                  closeModal={closeModal}
                  showSuccessModal={showSuccessModal}
              />
          </ModalPopUp>
      }
      {
        isSuccess &&
        <ModalPopUp
            modalTitle={successModalTitle}
            closeModal={closeSuccessModal}
        >
            <SuccessModal />
        </ModalPopUp>
      }
      <div className="tattoo-style__list">
        <AliceCarousel
          items={tattooStylesAliceArray}
          responsive={responsive}
          controlsStrategy="alternate"
          mouseTracking
        />
      </div>
      <div className="tattoo-style__item-content">
        { isAuth &&
          <div className={"tattoo-style__item-actions"}>
            <button
                className={"btn btn--icon"}
                onClick={() => {setEditTattooStyleMode(true)}}
            >
                <svg><use href={`${Sprite}#edit`}/></svg>
            </button>
            <button
                className={"btn btn--icon"}
                onClick={() => {deleteTattooStyle(activeStyle._id)}}
            >
                <svg><use href={`${Sprite}#trash`}/></svg>
            </button>
          </div>
        }
        {
          editTattooStyleMode &&
          <ModalPopUp
              modalTitle={modalTitle}
              closeModal={closeEditModal}
          >
              <UpdateTattooStyleFormFormik
                  style={activeStyle}
                  editTattooStyle={editTattooStyle}
                  closeModal={closeEditModal}
                  showSuccessModal={showSuccessModal}
              />
          </ModalPopUp>
        }
        <div>
          <h2 className="title title--secondary page-block__title tattoo-style__title">
            {activeStyle ? activeStyle.value : "---"}
          </h2>
          <div className="tattoo-style__text">
            {activeStyle ? activeStyle.description : "---"}
          </div>
        </div>
      </div>
    </section>
  )
})
