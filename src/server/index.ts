import express from "express"
import { cfg } from "../config"
import { getLatestUpdate, getDocument } from "../database"

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
    // documents/860500102219
    const inn = request.params.inn as string
    if (!inn) {
      response.send("Error. Please specify inn.")
    } else {
      const postfix = (await getLatestUpdate())?.postfix
      console.log(postfix)

      const fields = await getDocument(inn, postfix)
      response.type("application/json")
      fields.success ? response.status(200) : response.status(404)

      response.send(
        fields.success
          ? JSON.stringify(fields.data)
          : "Error. Please check params."
      )
    }
  })

  app.listen(port, () => console.log(`App is listening on port ${port}!`))
}

startServer()
