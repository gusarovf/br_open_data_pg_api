import { Update } from './actions/types/common-types'
import { poolQuery } from './utils'

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


