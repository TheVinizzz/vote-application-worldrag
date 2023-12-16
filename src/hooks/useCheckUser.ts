"use client"

import axios from "axios"

export async function verifyUser(server: "Fenix" | "Aegir", login: string) {
  const params = new URLSearchParams();
  params.append('server', server);
  params.append('acao', 'yes');
  params.append('login', login);
  const response = await axios.post('https://worldrag.com/webservice-user.php', params, {
    headers: { 'content-type': 'application/x-www-form-urlencoded' }
  })
  if (response.data.result) {
    return "success!"
  } else {
    throw new Error("Usuario falhou")
  }
}