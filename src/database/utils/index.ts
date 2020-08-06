import { dbConn } from "../../config"
import { Pool } from "pg"

const pool = new Pool({ ...dbConn })

export const poolQuery = async (query: string): Promise<any[] | undefined> => {
  const pQuery = async (): Promise<any[] | undefined> => {
    const client = await pool.connect()
    try {
      const res = await client.query(query)
      return res?.rows?.length ? res.rows : undefined
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
