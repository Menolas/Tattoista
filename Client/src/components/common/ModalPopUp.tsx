import * as React from "react"

type PropsType = {
    isOpen: boolean
    modalTitle?: string
    closeModal: () => void
    children: any
}

export const ModalPopUp: React.FC<PropsType> = React.memo(({
    isOpen,
    modalTitle,
    closeModal,
    children
}) => {
  return (
    <div className={isOpen ? 'modal-wrap open' : 'modal-wrap'}>
      <div className={'modal-wrap__inner-block'}>
          <div className={'modal__header'}>
              <h2 className={'modal__title'}>{modalTitle}</h2>
              <button
                  className={'close-button modal-wrap__close-btn'}
                  onClick={closeModal}
              >
              </button>
          </div>
          {children}
      </div>
    </div>
  )
})
