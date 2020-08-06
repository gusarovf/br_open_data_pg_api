import { poolQuery } from "../../utils"
import { Document, SubjectV1, SubjectLocation } from "../types/v1"

export const getDocument = async (
  inn: string | number,
  postfix: string = ""
): Promise<{ success: boolean; data: Document[] }> => {
  const fileTable = `file${postfix}`
  const docTable = `document${postfix}`
  const subjTable = `subject${postfix}`
  const subjAddressTable = `subject_location${postfix}`

  const subjectRes = await poolQuery(
    `SELECT
          ${subjTable}.id,
          ${subjTable}.document_id AS "documentId",
          ${subjTable}.is_organisation AS "isOrganisation",
          ${subjTable}.subject_name_full AS "subjectNameFull",
          ${subjTable}.subject_name_short AS "subjectNameShort",
          ${subjTable}.name,
          ${subjTable}.middle_name AS "middleName",
          ${subjTable}.last_name AS "lastName",
          ${subjTable}.inn,
          ${docTable}.doc_raw_id AS "docRawId",
          ${docTable}.created_at AS "docCreatedAt",
          ${docTable}.included_at AS "docIncludedAt",
          ${docTable}.subject_type AS "docSubjectType",
          ${docTable}.subject_category AS "docSubjectCategory",
          ${docTable}.is_new AS "docIsNew",
          ${fileTable}.file_name AS "fileFileName"
       FROM ${subjTable}
       LEFT JOIN ${docTable} ON ${subjTable}.document_id = ${docTable}.id
       LEFT JOIN ${fileTable} ON ${docTable}.file_id = ${fileTable}.id
       WHERE 
          ${subjTable}.inn='${inn}'
       LIMIT 1;
       `
  )
  const subj = subjectRes?.length ? (subjectRes[0] as SubjectV1) : null
  if (!subjectRes?.length || !subj) return { success: false, data: [] }

  const subjectLocRes = await poolQuery(
    `SELECT
          ${subjAddressTable}.region_code AS "regionCode",
          ${subjAddressTable}.region_name AS "regionName",
          ${subjAddressTable}.region_type AS "regionType",
          ${subjAddressTable}.area_name AS "areaName",
          ${subjAddressTable}.area_type AS "areaType",
          ${subjAddressTable}.city_name AS "cityName",
          ${subjAddressTable}.city_type AS "cityType",
          ${subjAddressTable}.town_name AS "townName",
          ${subjAddressTable}.town_type AS "townType"
       FROM ${subjAddressTable}
       WHERE 
          ${subjAddressTable}.subject_id=${subj.id}
       LIMIT 1;
       `
  )
  const subjLoc = subjectLocRes?.length
    ? (subjectLocRes?.[0] as SubjectLocation)
    : null

  return {
    success: subjectRes.length >= 1,
    data: [
      {
        fileId: (subj.fileFileName as string).replace(".xml", ""),
        id: `${subj.docRawId}`,
        createdAt: subj.docCreatedAt
          ? new Date(subj.docCreatedAt)
          : new Date("0000-00-00"),
        publishedAt: subj.docIncludedAt
          ? new Date(subj.docIncludedAt)
          : new Date("0000-00-00"),
        type: `${subj.docSubjectType}`,
        category: `${subj.docSubjectCategory}`,
        new: `${subj.docIsNew}`,
        subjectType: subj.isOrganisation ? "organization" : "individual",
        subjectName: subj.subjectNameFull || "",
        subjectShortName: subj.subjectNameShort || "",
        subjectInn: subj.inn || "",
        subjectNameSurname: subj.lastName || "",
        subjectNameName: subj.name || "",
        subjectNamePatronymic: subj.middleName || "",
        addressRegionCode: subjLoc?.regionCode || "",
        addressRegionAddressType: subjLoc?.regionType || "",
        addressRegionAddressName: subjLoc?.regionName || "",
        addressAreaAddressType: subjLoc?.areaType || "",
        addressAreaAddressName: subjLoc?.areaName || "",
        addressCityAddressType: subjLoc?.cityType || "",
        addressCityAddressName: subjLoc?.cityName || "",
        addressLocalityAddressType: subjLoc?.townType || "",
        addressLocalityAddressName: subjLoc?.townName || "",
      },
    ],
  }
}
