import Contact from "../db/contact.js";
import HttpError from "../helpers/HttpError.js";

// Function to list all contacts
async function listContacts({ page = 1, limit = 20, favorite } = {}) {
  const skip = (page - 1) * limit;

  const filter = favorite ? { favorite: favorite === "true" } : {};

  try {
    const contacts = await Contact.find(filter)
      .skip(skip)
      .limit(parseInt(limit));
    return contacts;
  } catch (error) {
    throw HttpError(500, "Error reading contacts");
  }
}

// Function to get a contact by ID
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

// Function to remove a contact by ID
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

// Function to add a new contact
async function addContact(name, email, phone) {
  try {
    const newContact = new Contact({ name, email, phone });
    await newContact.save();
    return newContact;
  } catch (error) {
    throw HttpError(500, "Error adding contact");
  }
}

// Function to update a contact by ID
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

// Function to update the 'favorite' status of a contact by ID
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
