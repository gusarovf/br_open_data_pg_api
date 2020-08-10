import { getDocument } from "../database/actions/selects/selects_v1"
import { getDocument as getDocumentV2 } from "../database/actions/selects/selects_v2"
import { getLatestUpdatePostfix } from "../database"
import { cfg } from "../config"
import express from "express"
import { getDbSize } from "../database/actions/selects"

export const startServer = () => {
  const app = express()
  const port = cfg.serverPort

  app.get("/", function (request, response) {
    const userAgent = request.headers["user-agent"]
    if (typeof userAgent === "string" && userAgent.startsWith("kube-probe/")) {
      response.writeHead(200)
      response.end()
      return
    }
  })

  app.get("/documents/:inn", async (request, response) => {
    // /documents/860500102219
    const inn = request.params.inn as string
    if (!inn) {
      response.send("Error. Please specify inn.")
    } else {
      const postfix = (await getLatestUpdatePostfix()) || ""
      const fields = await getDocument(inn, postfix)
      response.type("application/json")
      fields.success ? response.status(200) : response.status(404)

      response.send(fields.success ? JSON.stringify(fields.data) : [])
    }
  })

  app.get("/v2/documents/:inn", async (request, response) => {
    // /v2/documents/143523123723,143523630498
    const inn = request.params.inn as string
    if (!inn) {
      response.send("Error. Please specify inn.")
    } else {
      const inns = inn.includes(",")
        ? inn.split(",").map((inn: string) => inn.replace(/\D+/g, ""))
        : [inn.replace(/\D+/g, "")]

      const postfix = (await getLatestUpdatePostfix()) || ""
      const fields = await getDocumentV2(inns, postfix)
      response.type("application/json")
      fields.success ? response.status(200) : response.status(404)

      response.send(fields.success ? JSON.stringify(fields.data) : [])
    }
  })

  app.get("/dbsize", async (request, response) => {
    const fields = await getDbSize()
    response.type("application/json")
    fields.success ? response.status(200) : response.status(404)

    response.send(fields.success ? JSON.stringify(fields.data) : [])
  })

  app.listen(port, () => console.log(`App is listening on port ${port}!`))
}
