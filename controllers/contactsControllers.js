import Contact from "../models/contact.js";
import HttpError from "../helpers/HttpError.js";

export async function getAllContacts(req, res, next) {
  const page = req.query.page || 1;
  const per_page = req.query.per_page || 12;
  const skip = (page - 1) * per_page;
  const favorite = req.query.favorite;

  try {
    const ownerId = { owner: req.user.id };

    let query = Contact.find(ownerId);

    if (favorite === "true") {
      query = query.where("favorite").equals(true);
    }

    const allContacts = await query.skip(skip).limit(per_page).exec();

    res.status(200).send(allContacts);
  } catch (error) {
    next(error);
  }
}

export async function getOneContact(req, res, next) {
  const { id } = req.params;

  try {
    const oneContact = await Contact.findOne({ _id: id, owner: req.user.id });

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
    const deletedContact = await Contact.findOneAndDelete({
      _id: id,
      owner: req.user.id,
    });

    if (deletedContact === null) {
      throw HttpError(404);
    }

    res.status(200).send({ id });
  } catch (error) {
    next(error);
  }
}

export async function createContact(req, res, next) {
  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    owner: req.user.id,
  };

  try {
    const newContact = await Contact.create({ contact });
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
    const result = await Contact.findOneAndUpdate(
      { _id: id, owner: req.user.id },
      req.body,
      { new: true }
    );

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
    const result = await Contact.findOneAndUpdate(
      { _id: id, owner: req.user.id },
      req.body,
      { new: true }
    );

    if (result === null) {
      throw HttpError(404);
    }

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
}
