import * as React from "react"
// @ts-ignore
import avatar from "../../../assets/img/fox.webp"
// @ts-ignore
import Sprite from "../../../assets/svg/sprite.svg"
import { NavLink } from "react-router-dom"
import {ClientType, ContactType} from "../../../types/Types"
import { API_URL } from "../../../http"
import {Tooltip} from "react-tooltip"
import {Confirmation} from "../../common/Confirmation"
import {useState} from "react"
import {ModalPopUp} from "../../common/ModalPopUp"

type PropsType = {
  client: ClientType
  isDeletingInProcess: Array<string>
  deleteClient: (clientId: string) => void
  reactivateClient: (clientId: string) => void
}

export const ArchivedClient: React.FC<PropsType> = React.memo(({
  client,
  isDeletingInProcess,
  deleteClient,
  reactivateClient
}) => {

  const [needConfirmation, setNeedConfirmation] = useState<boolean>(false)

  const closeModal = () => {
    setNeedConfirmation(false)
  }

  const deleteClientCallBack = () => {
    deleteClient(client._id)
  }

  const clientContacts: ContactType = client.contacts

  const contactsArray = Object.keys(clientContacts).map(contact => {
    return clientContacts[contact] ?
      <li key={contact}>
        <span>{contact}:&nbsp;</span>
        <span>{clientContacts[contact]}</span>
      </li> : null
  })

  const clientAvatar = client.avatar ? `${API_URL}/archivedClients/${client._id}/avatar/${client.avatar}` : avatar

  return (
    <li className="admin__card admin__card--client">
      <div className="client-profile__header">
        <NavLink
            to={`/admin/profile?clientId=${client._id}`}
            className="admin__card-link client-profile">
          <div className="client-profile__avatar">
            <img src={clientAvatar} alt={""}/>
          </div>
          <div className="client-profile__details">
            <div className="client-profile__name">
              <span>Name:&nbsp;</span>
              <span>{client.fullName}</span>
            </div>
          </div>
        </NavLink>
        <div className="admin__card-action-btns client-profile__action-btns">
          <button
              data-tooltip-id="my-tooltip"
              data-tooltip-content="Restore client"
              className={"btn btn--icon"}
              disabled={isDeletingInProcess?.some(id => id === client._id)}
              onClick={() => reactivateClient(client._id)}
          >
            <svg><use href={`${Sprite}#smile`}/></svg>
          </button>
          <button
              data-tooltip-id="my-tooltip"
              data-tooltip-content="Delete client"
              className={"btn btn--icon"}
              disabled={isDeletingInProcess?.some(id => id === client._id)}
              onClick={() => {
                setNeedConfirmation(true)
              }}
          >
            <svg><use href={`${Sprite}#trash`}/></svg>
          </button>
        </div>
      </div>
      <div>
        <ul className="list admin__card-contacts-list">
          { contactsArray }
        </ul>
      </div>
      {
          client.gallery && client.gallery.length > 0 &&
        <div className="client-profile__gallery">
          <ul className="client-profile__gallery-list list">
            {
              client.gallery?.map((item, i) => <li key={i}>
                <img src={`${API_URL}/archivedClients/${client._id}/doneTattooGallery/${item}`} alt={''}/>
              </li>)
            }
          </ul>
        </div>
      }
      {
          needConfirmation &&
          <ModalPopUp
              modalTitle={''}
              closeModal={closeModal}
          >
            <Confirmation
                content={'Are you sure? You about to delete this client FOREVER along with  all the data and images...'}
                confirm={deleteClientCallBack}
                cancel={closeModal}
            />
          </ModalPopUp>
      }
      <Tooltip id="my-tooltip" />
    </li>
  )
})
