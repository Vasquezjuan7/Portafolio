export interface ContactSubmission {
  senderName: string;
  senderEmail: string;
  messageContent: string;
  timestamp: string;
}

export interface FormStatusState {
  submitting: boolean;
  success: boolean;
  errorMessage: string | null;
}
