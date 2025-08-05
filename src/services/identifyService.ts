import prisma from '../config/prisma';
import { IdentifyRequest, ContactResponse, LinkPrecedence, ResponseContact } from '../types';
import { normalizeEmail, normalizePhone } from '../utils/helpers';
import { formatResponse } from '../utils/response';

export const identifyContact = async (
  body: IdentifyRequest
): Promise<ContactResponse> => {
  const { email, phoneNumber } = body;
  const normalizedEmail = normalizeEmail(email);
  const normalizedPhone = normalizePhone(phoneNumber);

  if (!normalizedEmail && !normalizedPhone) {
    throw new Error('At least one contact method required');
  }

  return prisma.$transaction(async (tx: any) => {
    // finding matching contacts
    const whereClause: any = {
      deletedAt: null,
      OR: [
        ...(normalizedEmail ? [{ email: normalizedEmail }] : []),
        ...(normalizedPhone ? [{ phoneNumber: normalizedPhone }] : []),
      ],
    };

    const matchingContacts = await tx.contact.findMany({
      where: whereClause,
    });

    // collecting primary contact IDs
    const primaryContactIds = new Set<number>();
    for (const contact of matchingContacts) {
      if (contact.linkPrecedence === LinkPrecedence.primary) {
        primaryContactIds.add(contact.id);
      } else if (contact.linkedId) {
        primaryContactIds.add(contact.linkedId);
      }
    }

    // fetching primary contacts
    const primaryContacts = primaryContactIds.size > 0
      ? await tx.contact.findMany({
          where: {
            id: { in: [...primaryContactIds] },
            linkPrecedence: LinkPrecedence.primary,
            deletedAt: null,
          },
          orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
        })
      : [];

    // if no match found, create new contact 
    if (primaryContacts.length === 0) {
      const newContact = await tx.contact.create({
        data: {
          email: normalizedEmail,
          phoneNumber: normalizedPhone,
          linkPrecedence: LinkPrecedence.primary,
        },
      });
      
      return formatResponse(
        newContact as ResponseContact,
        [newContact as ResponseContact]
      );
    }

    // find oldest primary contact
    const oldestPrimary = primaryContacts[0];
    const otherPrimaries = primaryContacts.slice(1);

    // convert other primaries to secondary
    if (otherPrimaries.length > 0) {
      await Promise.all([
        // update other primary contacts
        tx.contact.updateMany({
          where: { id: { in: otherPrimaries.map((p: any) => p.id) } },
          data: {
            linkPrecedence: LinkPrecedence.secondary,
            linkedId: oldestPrimary.id,
            updatedAt: new Date(),
          },
        }),
        
        // update contacts linked to other primaries
        tx.contact.updateMany({
          where: { linkedId: { in: otherPrimaries.map((p: any) => p.id) } },
          data: { linkedId: oldestPrimary.id },
        }),
      ]);
    }

    // fetch all contacts in the cluster
    let clusterContacts = await tx.contact.findMany({
      where: {
        OR: [
          { id: oldestPrimary.id },
          { linkedId: oldestPrimary.id },
        ],
        deletedAt: null,
      },
    });

    // check: if contact needs to be created
    const shouldCreate = (normalizedEmail && !clusterContacts.some((c: any) => c.email === normalizedEmail)) ||
                        (normalizedPhone && !clusterContacts.some((c: any) => c.phoneNumber === normalizedPhone));

    if (shouldCreate) {
      const newSecondary = await tx.contact.create({
        data: {
          email: normalizedEmail,
          phoneNumber: normalizedPhone,
          linkPrecedence: LinkPrecedence.secondary,
          linkedId: oldestPrimary.id,
        },
      });
      clusterContacts.push(newSecondary);
    }

    return formatResponse(
      oldestPrimary as ResponseContact,
      clusterContacts as ResponseContact[]
    );
  });
};