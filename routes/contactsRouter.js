import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import validateBody from "../helpers/validateBody.js";

const contactsRouter = express.Router();
const jsonParser = express.json();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post(
  "/",
  jsonParser,
  validateBody(createContactSchema),
  createContact
);

contactsRouter.put(
  "/:id",
  jsonParser,
  validateBody(createContactSchema),
  updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  jsonParser,
  validateBody(updateContactSchema),
  updateStatusContact
);

export default contactsRouter;
