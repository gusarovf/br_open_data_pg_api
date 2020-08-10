type Nullable<T> = T | null

export interface Document {
  archive: ArchiveData
  file: FileData
  document: DocumentData
  subject: {
    isOrganisation: boolean
    organisation: Organisation
    indivudial: Individual
    inn: string

    locations: sLocation[]
    okved: SubjectOkved
    okpd2: SubjectOkpd2[]

    licence: Licence[]
    partnership: Partnership[]
    contract: Contract[]
    agreement: Agreement[]
  }
}

//

export interface ArchiveData {
  archiveUrl: string // Ссылка на архив
  archiveDate: Date // Дата архива
  structureUrl: string // Ссылка на структуру файла
  structureDate: Date // Дата структуры файла
}

export interface FileData {
  fileId: string // Название файла в котором был элемент
}

export interface DocumentData {
  documentId: string // ИдДок
  createdAt: Date // ДатаСост
  includedAt: Date //  ДатаВклМСП
  type: string // ВидСубМСП
  category: string // КатСубМСП
  isNew: boolean // ПризНовМСП
  isSocial: boolean // СведСоцПред
}

export interface SubjectData {
  subjectId: number
  isOrganisation: boolean
  orgNameFull: string
  orgNameShort: string
  subjectName: string
  subjectMiddleName: string
  subjectLastName: string
  inn: string
}

export interface Organisation {
  name: { fullName: Nullable<string>; shortName: Nullable<string> }
}

export interface Individual {
  name: {
    fullName: Nullable<string>
    firstName: Nullable<string>
    middleName: Nullable<string>
    lastName: Nullable<string>
  }
}

export interface sLocation {
  regionCode: string
  fullAddress: string
  splittedAddress: {
    region: Address // Регион
    area: Address // Район
    city: Address // Город
    town: Address // НаселПункт
  }
}

export interface Address {
  type: Nullable<string>
  name: Nullable<string>
}

export interface SubjectOkved {
  main: Okved[] | []
  additional: Okved[] | []
}

export interface Okved {
  code: string // КодОКВЭД
  name: string // НаимОКВЭД
  description: Nullable<string>
}

export interface SubjectOkpd2 {
  code: string // КодПрод
  name: string // НаимПрод
  description: Nullable<string>
}

export interface Licence {
  serial: string // СерЛиценз
  number: string // НомЛиценз
  type: string // ВидЛиценз
  releaseDate: Date // ДатаЛиценз
  dateStart: Date // ДатаНачЛиценз
  dateEnd: Date // ДатаКонЛиценз
  releasedBy: string // ОргВыдЛиценз
  dateCancel: string // ДатаОстЛиценз
  cancelledBy: string // ОргОстЛиценз
  licenceNames: string[] // НаимЛицВД
}

export interface Customer {
  customerName: string // НаимЮЛ_ПП / НаимЮЛ_ЗК / НаимЮЛ_ЗД
  customerInn: string // ИННЮЛ_ПП / ИННЮЛ_ЗК / ИННЮЛ_ЗД
}

export interface Partnership extends Customer {
  contractNumber: string // НомДог
  contractDate: Nullable<Date> // ДатаДог
}

export interface Contract extends Customer {
  contractSubject: Nullable<string> // ПредмКонтр
  contractRegNumber: string // НомКонтрРеестр
  contractDate: Nullable<Date> // ДатаКонтр
}

export interface Agreement extends Customer {
  agreementSubject: Nullable<string> // ПредмДог
  agreementRegNumber: string // НомДогРеестр
  agreementDate: Nullable<Date> // ДатаДог
}
