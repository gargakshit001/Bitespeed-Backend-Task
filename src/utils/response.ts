import { ContactResponse, ResponseContact } from '../types';

export function formatResponse(
  primaryContact: ResponseContact,
  allContacts: ResponseContact[]
): ContactResponse {
  // collect unique emails and phone numbers
  const emailSet = new Set<string>();
  const phoneSet = new Set<string>();
  const secondaryContactIds: number[] = [];

  for (const contact of allContacts) {
    if (contact.email) emailSet.add(contact.email);
    if (contact.phoneNumber) phoneSet.add(contact.phoneNumber);
    if (contact.linkPrecedence === 'secondary') {
      secondaryContactIds.push(contact.id);
    }
  }

  // sorting emails with primary contact's email first
  const emails = Array.from(emailSet);
  if (primaryContact.email) {
    const primaryIndex = emails.indexOf(primaryContact.email);
    if (primaryIndex > -1) emails.splice(primaryIndex, 1);
    emails.unshift(primaryContact.email);
  }

  // sorting phone numbers with primary contact's phone first
  const phoneNumbers = Array.from(phoneSet);
  if (primaryContact.phoneNumber) {
    const primaryIndex = phoneNumbers.indexOf(primaryContact.phoneNumber);
    if (primaryIndex > -1) phoneNumbers.splice(primaryIndex, 1);
    phoneNumbers.unshift(primaryContact.phoneNumber);
  }

  // sorting secondary IDs
  secondaryContactIds.sort((a, b) => a - b);

  return {
    contact: {
      primaryContactId: primaryContact.id,
      emails,
      phoneNumbers,
      secondaryContactIds,
    },
  };
}