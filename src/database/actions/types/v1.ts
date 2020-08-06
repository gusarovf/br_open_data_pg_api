export type Nullable<T> = T | null

export type SubjectType = "organization" | "individual"

export interface Document {
  fileId: string // файл в котором был элемент
  id: string // поле "ИдДок" элемента
  createdAt: Date // поле "ДатаСост" элемента
  publishedAt: Date // поле "ДатаВклМСП" элемента
  type: string // поле "ВидСубМСП" элемента
  category: string // поле "КатСубМСП" элемента
  new: string // поле "ПризНовМСП" элемента
  subjectType: SubjectType //  organization или individual
  subjectName: string // поле "НаимОрг" элемента "ОргВклМСП"
  subjectShortName: Nullable<string> // поле "НаимОргСокр" элемента "ОргВклМСП"
  subjectInn: string // поле "ИННЮЛ" или "ИННФЛ" элемента "ОргВклМСП" или "ИПВклМСП" соответственно
  subjectNameSurname: Nullable<string> // поле "Фамилия" элемента "ИПВклМСП"
  subjectNameName: Nullable<string> // поле "Имя" элемента "ИПВклМСП"
  subjectNamePatronymic: Nullable<string> // поле "Отчество" элемента "ИПВклМСП"
  addressRegionCode: string // поле "КодРегион" элемента "СведМН"
  addressRegionAddressType: string // поле "Тип" элемента "Регион"
  addressRegionAddressName: string // поле "Наим" элемента "Регион"
  addressAreaAddressType: string // поле "Тип" элемента "Район"
  addressAreaAddressName: string // поле "Наим" элемента "Район"
  addressCityAddressType: string // поле "Тип" элемента "Город"
  addressCityAddressName: string // поле "Наим" элемента "Город"
  addressLocalityAddressType: string // поле "Тип" элемента "НаселПункт"
  addressLocalityAddressName: string // поле "Наим" элемента "НаселПункт"
}

export interface SubjectV1 {
  id: number
  documentId: number
  isOrganisation: number
  subjectNameFull: string
  subjectNameShort: string
  name: string
  middleName: string
  lastName: string
  inn: string
  docRawId: string
  docCreatedAt: string
  docIncludedAt: string
  docSubjectType: string
  docSubjectCategory: string
  docIsNew: string
  fileFileName: string
}

export interface SubjectLocation {
  regionCode: string
  regionName: string
  regionType: string
  areaName: string
  areaType: string
  cityName: string
  cityType: string
  townName: string
  townType: string
}
