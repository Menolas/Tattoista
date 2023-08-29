export interface ContactType {
    [key: string]: string;
}

export type ContactsType = {
    "email": string | undefined,
    "insta": string | undefined,
    "messenger": string | undefined,
    "phone": string | undefined,
    "whatsapp": string | undefined,
}

export type ClientType = {
    _id: string
    fullName: string
    createdAt?: any
    contacts: {},
    avatar?: File | string,
    gallery?: Array<string>
}

export type CustomerType = {
    _id: string
    fullName: string
    message?: string
    status: boolean
    createdAt?: any
    contacts: {},
}

export type FaqType = {
    _id: string
    answer: string
    question: string
}

export type ServiceType = {
    _id: string
    title: string
    wallPaper: string
    conditions: Array<string>
}

export type TattooStyleType = {
    _id: string,
    value: string,
    wallPaper: string,
    description: string
}

export type GalleryItemType = {
    _id: string
    fileName: string
    categories: Array<String>
}

export interface LoginFormValues {
    username: string
    password: string
}

export interface AddCustomerFormValues  {
    name: string,
    contact: string,
    contactValue: string,
    message?: string,
    consent?: boolean,
}

export interface AddClientFormValues {
    avatar: File | string | null,
    name: string,
    email: string | null,
    insta: string | null,
    messenger: string | null,
    phone: string | null,
    whatsapp: string | null,
}

export type PageType = {
    _id: string
    name: string
    isActive: boolean
    title: string
    content: string
    wallPaper: Array<string>
}
