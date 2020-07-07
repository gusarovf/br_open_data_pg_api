import { dbConn } from "../config"
import { Pool } from "pg"
import { Document } from "../server/types"

const pool = new Pool({ ...dbConn })

export const poolQuery = async (query: string): Promise<any[] | undefined> => {
  const pQuery = async (): Promise<any[] | undefined> => {
    const client = await pool.connect()
    try {
      const res = await client.query(query)
      return res && res.rows ? res.rows : undefined
    } finally {
      client.release()
    }
  }

  try {
    return await pQuery()
  } catch (err) {
    console.log(`Query: \n ${query}`)
    console.log(
      `Error while executing query at poolQuery (${err}). See query above.`
    )
    throw new Error("Pool query error.")
  }
}

export const getLatestUpdate = async (): Promise<{
  postfix: string
} | null> => {
  const getUpdate = async (shouldGetOnlyLoaded: boolean) => {
    const upd = await poolQuery(`
    SELECT 
      archive_id,
      tables_postfix,
      is_loaded,
      are_tables_exist
    FROM
      updates 
    WHERE
      are_tables_exist=1
      ${shouldGetOnlyLoaded ? " AND is_loaded=1 " : ""}
    ORDER BY 
      id DESC
    LIMIT 1
  `)
    if (!upd?.length) return null
    return upd[0]
  }
  const upd = (await getUpdate(true)) || (await getUpdate(false))

  if (upd) {
    return {
      postfix: upd.tables_postfix,
    }
  }
  return null
}

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
        ${subjTable}.document_id,
        ${subjTable}.is_organisation,
        ${subjTable}.subject_name_full,
        ${subjTable}.subject_name_short,
        ${subjTable}.name,
        ${subjTable}.middle_name,
        ${subjTable}.last_name,
        ${subjTable}.inn,
        ${docTable}.doc_raw_id AS doc_raw_id,
        ${docTable}.created_at AS doc_created_at,
        ${docTable}.included_at AS doc_included_at,
        ${docTable}.subject_type AS doc_subject_type,
        ${docTable}.subject_category AS doc_subject_category,
        ${docTable}.is_new AS doc_is_new,
        ${fileTable}.file_name AS file_file_name
     FROM ${subjTable}
     LEFT JOIN ${docTable} ON ${subjTable}.document_id = ${docTable}.id
     LEFT JOIN ${fileTable} ON ${docTable}.file_id = ${fileTable}.id
     WHERE 
        ${subjTable}.inn='${inn}'
     LIMIT 1;
     `
  )
  const subj = subjectRes?.[0]
  if (!subjectRes?.length) return { success: false, data: [] }

  const subjectLocRes = await poolQuery(
    `SELECT
        ${subjAddressTable}.region_code,
        ${subjAddressTable}.region_name,
        ${subjAddressTable}.region_type,
        ${subjAddressTable}.area_name,
        ${subjAddressTable}.area_type,
        ${subjAddressTable}.city_name,
        ${subjAddressTable}.city_type,
        ${subjAddressTable}.town_name,
        ${subjAddressTable}.town_type
     FROM ${subjAddressTable}
     WHERE 
        ${subjAddressTable}.subject_id=${subj.id}
     LIMIT 1;
     `
  )
  const subjLoc = subjectLocRes?.[0]

  return {
    success: subjectRes.length >= 1,
    data: [
      {
        fileId: (subj.file_file_name as string).replace(".xml", ""),
        id: subj.doc_raw_id,
        createdAt: subj.doc_created_at
          ? new Date(subj.doc_created_at)
          : new Date("0000-00-00"),
        publishedAt: subj.doc_included_at
          ? new Date(subj.doc_included_at)
          : new Date("0000-00-00"),
        type: `${subj.doc_subject_type}`,
        category: `${subj.doc_subject_category}`,
        new: `${subj.is_new}`,
        subjectType: subj.is_organisation ? "organization" : "individual",
        subjectName: subj.subject_name_full,
        subjectShortName: subj.subject_name_short,
        subjectInn: subj.inn,
        subjectNameSurname: subj.last_name,
        subjectNameName: subj.name,
        subjectNamePatronymic: subj.middle_name,
        addressRegionCode: subjLoc?.region_code || null,
        addressRegionAddressType: subjLoc?.region_type || null,
        addressRegionAddressName: subjLoc?.region_name || null,
        addressAreaAddressType: subjLoc?.area_type || null,
        addressAreaAddressName: subjLoc?.area_name || null,
        addressCityAddressType: subjLoc?.city_type || null,
        addressCityAddressName: subjLoc?.city_name || null,
        addressLocalityAddressType: subjLoc?.town_type || null,
        addressLocalityAddressName: subjLoc?.town_name || null,
      },
    ],
  }
}
