import { Client, Account, Databases, Storage } from "appwrite";

const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)

if(import.meta.env.VITE_ENV == "dev"){
    client.setDevKey(import.meta.env.VITE_DEV_KEY);
}

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

export { client, account, databases, storage };