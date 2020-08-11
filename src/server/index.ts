import { getDocument } from "../database/actions/selects/selects_v1"
import { getDocument as getDocumentV2 } from "../database/actions/selects/selects_v2"
import { getLatestUpdatePostfix } from "../database"
import { cfg } from "../config"
import express, { Response as ExpressRes } from "express"
import { getDbSize } from "../database/actions/selects"

const sendResponse = (res: ExpressRes, success: boolean, data: any[]): void => {
  res.type("application/json")
  if (success) {
    res.status(200)
    res.send(JSON.stringify(data))
  } else {
    res.status(404)
    res.sendStatus(404)
  }
}

export const startServer = () => {
  const app = express()
  const port = cfg.serverPort

  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    next()
  })

  app.get("/", function (request, response) {
    const userAgent = request.headers["user-agent"]
    if (typeof userAgent === "string" && userAgent.startsWith("kube-probe/")) {
      response.writeHead(200)
      response.end()
      return
    }
  })

  app.get("/documents/:inn", async (req, res) => {
    // /documents/860500102219
    const inn = req.params.inn
    if (!inn) res.sendStatus(404)

    const postfix = (await getLatestUpdatePostfix()) || ""
    const fields = await getDocument(inn, postfix)
    sendResponse(res, fields.success, fields.data)
  })

  app.get("/v2/documents/:inn", async (req, res) => {
    // /v2/documents/143523123723,143523630498
    const inn = req.params.inn
    if (!inn) {
      res.sendStatus(404)
    } else {
      const inns = inn.includes(",")
        ? inn.split(",").map((inn) => inn.replace(/\D+/g, ""))
        : [inn.replace(/\D+/g, "")]

      const postfix = (await getLatestUpdatePostfix()) || ""
      const fields = await getDocumentV2(inns, postfix)
      sendResponse(res, fields.success, fields.data)
    }
  })

  app.get("/dbsize", async (request, response) => {
    const fields = await getDbSize()
    sendResponse(response, fields.success, [fields.data])
  })

  app.listen(port, () => console.log(`App is listening on port ${port}!`))
}
