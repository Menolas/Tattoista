import * as React from "react";
import {useEffect, useState} from "react";
import {ServiceType} from "../../../types/Types";
import {ServiceItem} from "./ServiceItem";
import {ModalPopUp} from "../../common/ModalPopUp";
import {UpdateServiceItemForm} from "../../Forms/UpdateServiceItemForm";
import {Preloader} from "../../common/Preloader";

type PropsType = {
  apiError: null | string;
  fakeApi: boolean;
  isFetching: boolean;
  isDeletingInProcess: Array<string>;
  isAuth: string;
  services: Array<ServiceType>;
  remove: (id: string) => void;
  setApiError: () => void;
};

export const Services: React.FC<PropsType> = React.memo(({
  apiError,
  fakeApi,
  isFetching,
  isAuth,
  services,
  remove,
  setApiError,
}) => {

  const [updateServiceData, setUpdateServiceData] = useState<{
      isUpdateMode: boolean,
      isAdd?: boolean,
      isEdit?: boolean,
      service?: ServiceType | null
  }>({isUpdateMode: false});

  useEffect(() => {
    if (updateServiceData.isUpdateMode && apiError === null) {
        closeUpdateServiceModal();
    }
  }, [apiError]);

  const closeUpdateServiceModal = () => {
      setUpdateServiceData({
          isUpdateMode: false,
          service: null,
          isAdd: false,
          isEdit: false
      });
      setApiError();
  };

  const updateServiceModalTitle = 'Update "Services" block';
  const addServiceModalTitle = 'Add a new Service';

  const servicesArray = services.map((item, i) => {
    return (
      <ServiceItem
        key={item._id}
        fakeApi={fakeApi}
        isAuth={isAuth}
        serviceIndex={i + 1}
        service={item}
        remove={remove}
        setUpdateServiceData={setUpdateServiceData}
      />
    )
  });

  return (
    <section className="page-block services container" id="services">
      {
         isAuth &&
         <button
             className={"btn btn--bg btn--light-bg admin-action-btn"}
             onClick={() => {setUpdateServiceData({
                 isUpdateMode: true,
                 isAdd: true,
                 isEdit: false,
             })}}
         >
             Add Service
         </button>
      }
      <h2 className="page-block__title">Studio services</h2>
      <ul className="services__list list">
        { isFetching
            ? <Preloader />
            : servicesArray
        }
      </ul>
      <ModalPopUp
        isOpen={updateServiceData.isUpdateMode}
        modalTitle={updateServiceData.isEdit ?
            updateServiceModalTitle : addServiceModalTitle}
        closeModal={closeUpdateServiceModal}
      >
        {
            updateServiceData.isUpdateMode &&
            <UpdateServiceItemForm
                apiError={apiError}
                service={updateServiceData.service}
                closeModal={closeUpdateServiceModal}
            />
        }
      </ModalPopUp>
    </section>
  )
});
