import { poolQuery } from "../../utils"
import * as tV2 from "../types/v2"

const getDocumentPrimaryInfo = async (
  inn: string | number,
  postfix: string = ""
): Promise<{
  success: boolean
  data: {
    archiveData: tV2.ArchiveData
    fileData: tV2.FileData
    documentData: tV2.DocumentData
    subjectData: tV2.SubjectData
  } | null
}> => {
  const archiveTable = `archive`
  const fileTable = `file${postfix}`
  const docTable = `document${postfix}`
  const subjTable = `subject${postfix}`

  const res = await poolQuery(
    `SELECT
        ${archiveTable}.archive_url,
        ${archiveTable}.archive_date,
        ${archiveTable}.structure_url,
        ${archiveTable}.structure_date,

        ${fileTable}.file_name,
        
        ${docTable}.doc_raw_id,
        ${docTable}.created_at AS doc_created_at,
        ${docTable}.included_at AS doc_included_at,
        ${docTable}.subject_type AS doc_subject_type,
        ${docTable}.subject_category AS doc_subject_category,
        ${docTable}.is_new AS doc_is_new,
        ${docTable}.is_social AS doc_is_social,
        
        ${subjTable}.id AS subject_id,
        ${subjTable}.is_organisation AS subject_is_organisation,
        ${subjTable}.subject_name_full,
        ${subjTable}.subject_name_short,
        ${subjTable}.name AS subject_name,
        ${subjTable}.middle_name AS subject_middle_name,
        ${subjTable}.last_name AS subject_last_name,
        ${subjTable}.inn AS subject_inn
     FROM ${subjTable}
     LEFT JOIN ${docTable} ON ${subjTable}.document_id = ${docTable}.id
     LEFT JOIN ${fileTable} ON ${docTable}.file_id = ${fileTable}.id
     LEFT JOIN ${archiveTable} ON ${fileTable}.archive_id = ${archiveTable}.id
     WHERE 
        ${subjTable}.inn='${inn}'
     LIMIT 1;
       `
  )

  if (res?.length) {
    const resData = res[0]

    return {
      success: true,
      data: {
        archiveData: {
          archiveUrl: resData.archive_url,
          archiveDate: new Date(resData.archive_date),
          structureUrl: resData.structure_url,
          structureDate: new Date(resData.structure_date),
        },
        fileData: {
          fileId: resData.file_name,
        },
        documentData: {
          documentId: resData.doc_raw_id,
          createdAt: new Date(resData.doc_created_at),
          includedAt: new Date(resData.doc_included_at),
          type: resData.doc_subject_type,
          category: resData.doc_subject_category,
          isNew: resData.doc_is_new > 1 ? true : false,
          isSocial: resData.doc_is_social > 1 ? true : false,
        },
        subjectData: {
          subjectId: resData.subject_id,
          isOrganisation: resData.subject_is_organisation > 0 ? true : false,
          orgNameFull: resData.subject_name_full,
          orgNameShort: resData.subject_name_short,
          subjectName: resData.subject_name,
          subjectMiddleName: resData.subject_middle_name,
          subjectLastName: resData.subject_last_name,
          inn: resData.subject_inn,
        },
      },
    }
  } else {
    return { success: false, data: null }
  }
}

const getSubjectLocations = async (
  subjectId: number,
  postfix: string = ""
): Promise<tV2.sLocation[] | []> => {
  if (!subjectId) return []

  const subjLocTable = `subject_location${postfix}`
  const res = await poolQuery(
    `SELECT
        region_code,
        region_name,
        region_type,
        concat_ws(' ', region_name, region_type) AS region,
        area_name,
        area_type,
        concat_ws(' ', area_name, area_type) AS area,
        city_name,
        city_type,
        concat_ws(' ', city_type, city_name) AS city,
        town_name,
        town_type,
        concat_ws(' ', town_type, town_name) AS town
     FROM ${subjLocTable}
     WHERE 
        subject_id = ${subjectId};`
  )

  return res?.length
    ? res.map((loc) => {
        return {
          regionCode: loc.region_code,
          fullAddress: `${[loc.region, loc.area, loc.city, loc.town]
            .filter((val) => !!val)
            .join(", ")}`,
          splittedAddress: {
            region: {
              type: loc.region_type,
              name: loc.region_name,
            },
            area: {
              type: loc.area_type,
              name: loc.area_name,
            },
            city: {
              type: loc.city_type,
              name: loc.city_name,
            },
            town: {
              type: loc.town_type,
              name: loc.area_name,
            },
          },
        }
      })
    : []
}

const getSubjectOkved = async (
  subjectId: number,
  postfix: string = ""
): Promise<tV2.SubjectOkved> => {
  const main: tV2.Okved[] = []
  const additional: tV2.Okved[] = []
  if (!subjectId) return { main, additional }

  const okvedTable = `okved${postfix}`
  const subjectOkvedTable = `subject_okved${postfix}`
  const res = await poolQuery(
    `SELECT
        ${subjectOkvedTable}.is_main AS subject_okved_is_main,
        ${okvedTable}.code AS okved_code,
        ${okvedTable}.name AS okved_name,
        ${okvedTable}.group_description AS okved_group_description
     FROM ${subjectOkvedTable}
     LEFT JOIN ${okvedTable} ON ${subjectOkvedTable}.okved_id = ${okvedTable}.id
     WHERE 
        ${subjectOkvedTable}.subject_id = ${subjectId};`
  )
  if (res?.length) {
    res.forEach((okv) => {
      const isMain = okv.subject_okved_is_main > 0
      delete okv["subject_okved_is_main"]
      isMain ? main.push(okv) : additional.push(okv)
    })
  }

  return { main, additional }
}

const getSubjectOkpd2 = async (
  subjectId: number,
  postfix: string = ""
): Promise<tV2.SubjectOkpd2[] | []> => {
  const okpd2Table = `okpd2${postfix}`
  const subjectOkpd2Table = `subject_okpd2${postfix}`

  const res = await poolQuery(
    `SELECT
        ${okpd2Table}.code,
        ${okpd2Table}.name,
        ${okpd2Table}.group_description AS description
     FROM ${subjectOkpd2Table}
     LEFT JOIN ${okpd2Table} ON ${subjectOkpd2Table}.okpd2_id = ${okpd2Table}.id
     WHERE 
        ${subjectOkpd2Table}.subject_id = ${subjectId};`
  )

  return res?.length ? ((res as unknown) as tV2.SubjectOkpd2[]) : []
}

const getSubjectLicenses = async (
  subjectId: number,
  postfix: string = ""
): Promise<tV2.Licence[] | []> => {
  if (!subjectId) return []
  const subjectLicenceTable = `subject_licence${postfix}`
  const subjectLicenceNameTable = `subject_licence_name${postfix}`
  const aggSeparator = "::::"

  const res = await poolQuery(
    `SELECT
        ${subjectLicenceTable}.serial,
        ${subjectLicenceTable}.number,
        ${subjectLicenceTable}.type,
        ${subjectLicenceTable}.release_date AS "releaseDate",
        ${subjectLicenceTable}.date_start AS "dateStart",
        ${subjectLicenceTable}.date_end AS "dateEnd",
        ${subjectLicenceTable}.released_by AS "releasedBy",
        ${subjectLicenceTable}.date_cancel AS "dateCancel",
        ${subjectLicenceTable}.cancelled_by AS "cancelledBy",
        string_agg(distinct ${subjectLicenceNameTable}.name, '${aggSeparator}') AS "licenceNames"
     FROM ${subjectLicenceTable}
     LEFT JOIN ${subjectLicenceNameTable} ON ${subjectLicenceNameTable}.licence_id = ${subjectLicenceTable}.id
     WHERE 
        ${subjectLicenceTable}.subject_id = ${subjectId}
     GROUP BY ${subjectLicenceTable}.id;`
  )

  return res?.length
    ? res.map((lic) => {
        lic["licenceNames"] = (lic["licenceNames"] as string).split(
          aggSeparator
        )
        return lic
      })
    : []
}

const getSubjectPartnerships = async (
  subjectId: number,
  postfix: string = ""
): Promise<tV2.Partnership[] | []> => {
  if (!subjectId) return []
  const subjectPartnershipTable = `subject_partnership${postfix}`

  const res = await poolQuery(
    `SELECT
        ${subjectPartnershipTable}.name AS "customerName",
        ${subjectPartnershipTable}.inn AS "customerInn",
        ${subjectPartnershipTable}.contract_number AS "contractNumber",
        ${subjectPartnershipTable}.contract_date AS "contractDate"
     FROM ${subjectPartnershipTable}
     WHERE 
        ${subjectPartnershipTable}.subject_id = ${subjectId};`
  )

  return res?.length ? ((res as unknown) as tV2.Partnership[]) : []
}

const getSubjectContracts = async (
  subjectId: number,
  postfix: string = ""
): Promise<tV2.Contract[] | []> => {
  if (!subjectId) return []
  const subjectPartnershipTable = `subject_contract${postfix}`

  const res = await poolQuery(
    `SELECT
        name AS "customerName",
        inn AS "customerInn",
        contract_subject AS "contractSubject",
        contract_number AS "contractRegNumber",
        contract_date AS "contractDate"
     FROM ${subjectPartnershipTable}
     WHERE 
        subject_id = ${subjectId}
     ORDER BY contract_date DESC;`
  )

  return res?.length ? ((res as unknown) as tV2.Contract[]) : []
}

const getSubjectAgreements = async (
  subjectId: number,
  postfix: string = ""
): Promise<tV2.Agreement[] | []> => {
  if (!subjectId) return []
  const subjectPartnershipTable = `subject_agreement${postfix}`

  const res = await poolQuery(
    `SELECT
        name AS "customerName",
        inn AS "customerInn",
        agreement_subject AS "agreementSubject",
        agreement_reg_number AS "agreementRegNumber",
        agreement_date AS "agreementDate"
     FROM ${subjectPartnershipTable}
     WHERE 
        subject_id = ${subjectId}
     ORDER BY agreement_date DESC;`
  )

  return res?.length ? ((res as unknown) as tV2.Agreement[]) : []
}

const getDoc = async (
  inn: string,
  postfix: string = ""
): Promise<tV2.Document | undefined> => {
  if (!inn) return

  const docInfo = await getDocumentPrimaryInfo(inn, postfix)
  if (!docInfo.success || !docInfo.data) return

  const docData = docInfo.data
  const docSubjectData = docInfo.data.subjectData
  const docSubjectId = docSubjectData.subjectId

  const locations = await getSubjectLocations(docSubjectId, postfix)
  const okved = await getSubjectOkved(docSubjectId, postfix)
  const okpd2 = await getSubjectOkpd2(docSubjectId, postfix)
  const licence = await getSubjectLicenses(docSubjectId, postfix)
  const partnership = await getSubjectPartnerships(docSubjectId, postfix)
  const contract = await getSubjectContracts(docSubjectId, postfix)
  const agreement = await getSubjectAgreements(docSubjectId, postfix)

  return {
    archive: docData.archiveData,
    file: docData.fileData,
    document: docData.documentData,
    subject: {
      isOrganisation: docSubjectData.isOrganisation,
      organisation: {
        name: {
          fullName: docSubjectData.orgNameFull,
          shortName: docSubjectData.orgNameShort,
        },
      },
      indivudial: {
        name: {
          fullName: [
            docSubjectData.subjectLastName,
            docSubjectData.subjectName,
            docSubjectData.subjectMiddleName,
          ].join(" "),
          firstName: docSubjectData.subjectName,
          middleName: docSubjectData.subjectMiddleName,
          lastName: docSubjectData.subjectLastName,
        },
      },
      inn: docSubjectData.inn,
      locations,
      okved,
      okpd2,
      licence,
      partnership,
      contract,
      agreement,
    },
  }
}

export const getDocument = async (
  inns: string[],
  postfix: string
): Promise<{ success: boolean; data: tV2.Document[] }> => {
  const documents = []
  if (inns.length) {
    for (const inn of inns) {
      const doc = await getDoc(inn, postfix)
      if (doc) documents.push(doc)
    }
  }
  return { success: documents.length > 0, data: documents }
}

if (require.main === module) {
  ;(async () => {
    const doc = await getDocument(["143523123723", "20143523630498"], "_prim")
    console.log(doc.data)
  })()
}
