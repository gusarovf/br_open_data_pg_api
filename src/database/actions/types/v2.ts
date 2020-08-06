type Nullable<T> = T | null

interface Document {
  archiveUrl: string // Ссылка на архив
  archiveDate: Date // Дата архива
  structureUrl: string // Ссылка на структуру файла
  structureDate: Date // Дата структуры файла
  fileId: string // название файла в котором был элемент

  documentId: string // ИдДок
  createdAt: Date // ДатаСост
  includedAt: Date //  ДатаВклМСП
  type: string // ВидСубМСП
  category: string // КатСубМСП
  isNew: boolean // ПризНовМСП
  isSocial: boolean // СведСоцПред
  isOrganisation: number

  oranisation: Organisation
  indivudial: Individual
  inn: string

  locations: sLocation[]
  okved: {
    main: Okved[]
    additional: Okved[]
  }
  licence: Licence[]
  product: Product[]
  partnership: Partnership[]
  contracts: Contract[]
  agreements: Agreement[]
}

//

interface Organisation {
  name: { fullName: Nullable<string>; shortName: Nullable<string> }
}

interface Individual {
  name: {
    firstName: Nullable<string>
    middleName: Nullable<string>
    lastName: Nullable<string>
  }
}

interface sLocation {
  regionCode: string
  fullAddress: string
  splittedAddress: {
    region: Address // Регион
    area: Address // Район
    city: Address // Город
    town: Address // НаселПункт
  }
}

interface Address {
  type: Nullable<string>
  name: Nullable<string>
}

interface Okved {
  code: string // КодОКВЭД
  name: string // НаимОКВЭД
  description: Nullable<string>
}

interface Licence {
  serial: string // СерЛиценз
  number: string // НомЛиценз
  type: string // ВидЛиценз
  releaseDate: string // ДатаЛиценз
  dateStart: string // ДатаНачЛиценз
  dateEnd: string // ДатаКонЛиценз
  releasedBy: string // ОргВыдЛиценз
  dateCancel: string // ДатаОстЛиценз
  cancelledBy: string // ОргОстЛиценз
  licenceNames: string[] // НаимЛицВД
}

interface Product {
  code: string // КодПрод
  name: string // НаимПрод
  description: Nullable<string>
  isHitech: boolean // ПрОтнПрод
}

interface Customer {
  customerName: string // НаимЮЛ_ПП / НаимЮЛ_ЗК / НаимЮЛ_ЗД
  customerInn: string // ИННЮЛ_ПП / ИННЮЛ_ЗК / ИННЮЛ_ЗД
}

interface Partnership extends Customer {
  contractNumber: string // НомДог
  contractDate: Nullable<string> // ДатаДог
}

interface Contract extends Customer {
  contractSubject: Nullable<string> // ПредмКонтр
  contractRegNumber: string // НомКонтрРеестр
  contractDate: Nullable<string> // ДатаКонтр
}

interface Agreement extends Customer {
  agreementSubject: Nullable<string> // ПредмДог
  agreementRegNumber: string // НомДогРеестр
  agreementDate: Nullable<string> // ДатаДог
}
