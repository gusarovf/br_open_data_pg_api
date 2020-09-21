import { Update } from "../types/common-types"
import { poolQuery } from "../../utils"

export const getDbSize = async (): Promise<{
  success: boolean
  data: { size: string }
}> => {
  const res = await poolQuery(
    "SELECT pg_size_pretty(pg_database_size(current_database())) as size;"
  )

  return {
    success: (res && res?.length > 0) || false,
    data: { size: res?.[0].size },
  }
}

const getUpdate = async (
  shouldGetOnlyLoaded: boolean
): Promise<Update | undefined> => {
  const upd = await poolQuery(`
    SELECT 
      archive_id AS "archiveId",
      tables_postfix AS "tablesPostfix",
      is_loaded AS "isLoaded",
      are_tables_exist as "areTablesExist"
    FROM
      update
    WHERE
      are_tables_exist = 1
      ${shouldGetOnlyLoaded ? " AND is_loaded = 1 " : ""}
    ORDER BY 
      id DESC
    LIMIT 1;`)

  if (!upd?.length) return
  return upd[0]
}

export const getLatestUpdatePostfix = async (): Promise<string | undefined> => {
  const upd = (await getUpdate(true)) || (await getUpdate(false))

  return upd ? upd.tablesPostfix : undefined
}

export const getBackendVersion = async (): Promise<{
  success: boolean
  data: {
    // дата обновления
    state: {
      time: string // ISO
    }
    // дата последней проверки
    log: {
      time: string // ISO
    }
  }
}> => {
  const update = (await getUpdate(true)) || (await getUpdate(false))
  interface archiveDate {
    record_created_at: string
  }
  interface updateCheckDate {
    check_date: string
  }

  let updateDate: undefined | archiveDate[] = undefined
  if (update) {
    const archiveDate = (await poolQuery(
      `SELECT record_created_at FROM archive WHERE id = ${update.archiveId} LIMIT 1;`
    )) as Array<archiveDate> | undefined
    updateDate = archiveDate?.length ? archiveDate : undefined
  }

  const updateCheckDate = (await poolQuery(
    "SELECT check_date FROM update_checks ORDER BY id DESC LIMIT 1"
  )) as Array<updateCheckDate> | undefined

  const isFound = updateDate?.length && updateCheckDate?.length
  return {
    success: isFound == 1,
    data: {
      state: {
        time: updateDate?.length
          ? new Date(updateDate[0].record_created_at).toISOString()
          : "",
      },
      log: {
        time: updateCheckDate?.length
          ? new Date(updateCheckDate[0].check_date).toISOString()
          : "",
      },
    },
  }
}

