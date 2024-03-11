import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res, next) => {
  const { page = 1, limit = 20, favorite } = req.query;
  try {
    const contacts = await contactsService.listContacts({
      page,
      limit,
      favorite,
    });
    res.status(200).json(contacts);
  } catch (error) {
    next(HttpError(500));
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const contact = await contactsService.getContactById(req.params.id);
    if (contact) {
      res.status(200).json(contact);
    } else {
      next(HttpError(404));
    }
  } catch (error) {
    next(HttpError(500));
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const contact = await contactsService.removeContact(req.params.id);
    if (contact) {
      res.status(200).json(contact);
    } else {
      next(HttpError(404));
    }
  } catch (error) {
    next(HttpError(500));
  }
};

export const createContact = async (req, res, next) => {
  try {
    const contact = await contactsService.addContact(req.body);
    res.status(201).json(contact);
  } catch (error) {
    next(HttpError(400, error.message));
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const contact = await contactsService.getContactById(req.params.id);
    if (!contact) {
      next(HttpError(404, "Contact not found"));
    } else if (contact.owner.toString() !== req.user._id.toString()) {
      next(HttpError(403, "Forbidden"));
    } else {
      const updatedContact = await contactsService.updateContact(
        req.params.id,
        req.body
      );
      if (updatedContact) {
        res.status(200).json(updatedContact);
      } else {
        next(HttpError(404, "Contact not found"));
      }
    }
  } catch (error) {
    next(HttpError(400, error.message));
  }
};

export const updateStatusContact = async (req, res, next) => {
  const { id } = req.params;
  const { favorite } = req.body;

  try {
    const updatedContact = await contactsService.updateContact(id, {
      favorite,
    });

    if (!updatedContact) {
      next(HttpError(404, "Contact not found"));
    } else {
      res.json(updatedContact);
    }
  } catch (error) {
    next(HttpError(400, error.message));
  }
};
