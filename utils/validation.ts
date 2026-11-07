export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return emailRegex.test(email.trim());
}

export function sanitizeText(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .trim();
}

export function validateFormFields(name: string, email: string, message: string): string | null {
  if (name.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
  if (!isValidEmail(email)) return 'El correo electrónico no es válido';
  if (message.trim().length < 10) return 'El mensaje debe tener al menos 10 caracteres';
  return null;
}
