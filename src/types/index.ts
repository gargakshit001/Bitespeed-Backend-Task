export interface IdentifyRequest {
  email?: string;
  phoneNumber?: string | number;
}

export interface ContactResponse {
  contact: {
    primaryContactId: number;
    emails: string[];
    phoneNumbers: string[];
    secondaryContactIds: number[];
  };
}

export enum LinkPrecedence {
  primary = 'primary',
  secondary = 'secondary'
}

// contact structure for response formatting
export interface ResponseContact {
  id: number;
  email: string | null;
  phoneNumber: string | null;
  linkPrecedence: 'primary' | 'secondary';
  linkedId?: number | null;
}