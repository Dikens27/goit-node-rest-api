import Contact from "../models/contact.js";
import HttpError from "../helpers/HttpError.js";

export async function getAllContacts(req, res, next) {
  try {
    const allContacts = await Contact.find();
    res.status(200).send(allContacts);
  } catch (error) {
    next(error);
  }
}

export async function getOneContact(req, res, next) {
  const { id } = req.params;

  try {
    const oneContact = await Contact.findById(id);

    if (oneContact === null) {
      throw HttpError(404);
    }

    res.status(200).send(oneContact);
  } catch (error) {
    next(error);
  }
}

export async function deleteContact(req, res, next) {
  const { id } = req.params;

  try {
    const deletedContact = await Contact.findByIdAndDelete(id);

    if (deletedContact === null) {
      throw HttpError(404);
    }

    res.status(200).send({ id });
  } catch (error) {
    next(error);
  }
}

export async function createContact(req, res, next) {
  const { name, email, phone } = req.body;

  try {
    const newContact = await Contact.create({ name, email, phone });
    res.status(201).send(newContact);
  } catch (error) {
    next(error);
  }
}

export async function updateContact(req, res, next) {
  const { id } = req.params;

  if (Object.keys(req.body).length === 0) {
    return res.status(400).send("Body must have at least one field");
  }

  try {
    const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });

    if (result === null) {
      throw HttpError(404);
    }

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
}

export async function updateStatusContact(req, res, next) {
  const { id } = req.params;

  try {
    const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });

    if (result === null) {
      throw HttpError(404);
    }

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
}
