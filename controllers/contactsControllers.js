import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res, next) => {
  const { page = 1, limit = 20, favorite } = req.query;
  const owner = req.user.id;
  try {
    const contacts = await contactsService.listContacts({
      page,
      limit,
      favorite,
      owner,
    });
    res.status(200).json(contacts);
  } catch (error) {
    next(HttpError(500));
  }
};

export const getOneContact = async (req, res, next) => {
  const contact = await contactsService.getContactById(req.params.id);
  if (
    !contact ||
    !contact.ownerId ||
    contact.ownerId.toString() !== req.user.id
  ) {
    return next(HttpError(404));
  }
  res.status(200).json(contact);
};

export const deleteContact = async (req, res, next) => {
  const contact = await contactsService.getContactById(req.params.id);
  if (
    !contact ||
    !contact.ownerId ||
    contact.ownerId.toString() !== req.user.id
  ) {
    return next(HttpError(404));
  }
  await contactsService.removeContact(req.params.id);
  res.status(200).json(contact);
};

export const createContact = async (req, res, next) => {
  const contact = await contactsService.addContact(req.body, req.user.id);
  res.status(201).json(contact);
};

export const updateContact = async (req, res, next) => {
  const contact = await contactsService.getContactById(req.params.id);
  if (
    !contact ||
    !contact.ownerId ||
    contact.ownerId.toString() !== req.user.id
  ) {
    return next(HttpError(404));
  }
  const updatedContact = await contactsService.updateContact(
    req.params.id,
    req.body
  );
  res.status(200).json(updateContact);
};

export const updateStatusContact = async (req, res, next) => {
  const { id } = req.params;
  const { favorite } = req.body;
  const contact = await contactsService.getContactById(id);
  if (
    !contact ||
    !contact.ownerId ||
    contact.ownerId.toString() !== req.user.id
  ) {
    return next(HttpError(404));
  }

  const favoriteContact = await contactsService.updateContact(id, { favorite });
  res.json(favoriteContact);
};
