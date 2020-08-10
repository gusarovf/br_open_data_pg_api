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
