import Contact from "../db/contacts.js";
import HttpError from "../helpers/HttpError.js";

async function listContacts({ page = 1, limit = 20, favorite, owner } = {}) {
  const skip = (page - 1) * limit;
  const filter = favorite
    ? { favorite: true, ownerId: owner }
    : { ownerId: owner };

  try {
    const contacts = await Contact.find(filter)
      .skip(skip)
      .limit(parseInt(limit));
    return contacts;
  } catch (error) {
    throw HttpError(500, "Error reading contacts");
  }
}

async function getContactById(contactId) {
  try {
    const contact = await Contact.findById(contactId);
    if (!contact) {
      throw HttpError(404, "Contact not found");
    }
    return contact;
  } catch (error) {
    throw HttpError(500, "Error getting contact by ID");
  }
}

async function removeContact(contactId) {
  try {
    const contact = await Contact.findByIdAndDelete(contactId);
    if (!contact) {
      throw HttpError(404, "Contact not found");
    }
    return contact;
  } catch (error) {
    throw HttpError(500, "Error removing contact");
  }
}

async function addContact({ name, email, phone }, ownerId) {
  try {
    const newContact = new Contact({ name, email, phone, ownerId });
    await newContact.save();
    return newContact;
  } catch (error) {
    throw HttpError(500, "Error adding contact");
  }
}

async function updateContact(id, updatedContact) {
  try {
    const contact = await Contact.findByIdAndUpdate(id, updatedContact, {
      new: true,
    });
    if (!contact) {
      throw HttpError(404, "Contact not found");
    }
    return contact;
  } catch (error) {
    throw HttpError(500, "Error updating contact");
  }
}

async function updateStatusContact(id, favorite) {
  try {
    const contact = await Contact.findByIdAndUpdate(
      id,
      { favorite },
      { new: true }
    );
    if (!contact) {
      throw HttpError(404, "Contact not found");
    }
    return contact;
  } catch (error) {
    throw HttpError(500, "Error updating contact status");
  }
}

const contactsService = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};

export default contactsService;
