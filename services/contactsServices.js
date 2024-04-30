import * as fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const contactsPath = path.resolve("db", "contacts.json");

async function readContacts() {
  const data = await fs.readFile(contactsPath, { encoding: "utf-8" });

  return JSON.parse(data);
}

function writeContacts(contacts) {
  return fs.writeFile(contactsPath, JSON.stringify(contacts, undefined, 2));
}

async function listContacts() {
  const contacts = await readContacts();

  return contacts;
}

async function getContactById(id) {
  const contacts = await readContacts();

  const contact = contacts.find((contact) => contact.id === id);

  if (typeof contact === "undefined") {
    return null;
  }

  return contact;
}

async function removeContact(id) {
  const contacts = await readContacts();

  const index = contacts.findIndex((contact) => contact.id === id);

  if (index === -1) {
    return null;
  }

  const removedContact = contacts[index];

  const newContacts = [
    ...contacts.slice(0, index),
    ...contacts.slice(index + 1),
  ];

  await writeContacts(newContacts);

  return removedContact;
}

async function addContact(name, email, phone) {
  const contacts = await readContacts();

  const newContact = { name, email, phone, id: crypto.randomUUID() };

  contacts.push(newContact);

  await writeContacts(contacts);

  return newContact;
}

async function rewriteContact(id, data) {
  const dataContacts = await readContacts();
  const allContacts = JSON.parse(dataContacts);
  const findContact = allContacts.findIndex((item) => item.id === id);
  if (findContact === -1) {
    return null;
  }

  allContacts[findContact] = { id, ...data };
  await writeContacts();

  return allContacts[findContact];
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  rewriteContact,
};
