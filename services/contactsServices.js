import Contact from "../db/contact.js";

// Function to list all contacts
async function listContacts() {
  try {
    const contacts = await Contact.find();
    return contacts;
  } catch (error) {
    console.error("Error reading contacts:", error);
  }
}

// Function to get a contact by ID
async function getContactById(contactId) {
  try {
    const contact = await Contact.findById(contactId);
    return contact;
  } catch (error) {
    console.error("Error getting contact by ID:", error);
  }
}

// Function to remove a contact by ID
async function removeContact(contactId) {
  try {
    const contact = await Contact.findByIdAndDelete(contactId);
    return contact;
  } catch (error) {
    console.error("Error removing contact:", error);
  }
}

// Function to add a new contact
async function addContact(name, email, phone) {
  try {
    const newContact = new Contact({ name, email, phone });
    await newContact.save();
    return newContact;
  } catch (error) {
    console.error("Error adding contact:", error);
  }
}

// Function to update a contact by ID
async function updateContact(id, updatedContact) {
  try {
    const contact = await Contact.findByIdAndUpdate(id, updatedContact, {
      new: true,
    });
    return contact;
  } catch (error) {
    console.error("Error updating contact:", error);
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
    return contact;
  } catch (error) {
    console.error("Error updating contact status:", error);
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
