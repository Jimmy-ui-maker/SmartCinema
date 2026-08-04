export function validateRegister(data) {
  const { firstName, lastName, email, phone, password } = data;

  if (!firstName || !lastName || !email || !phone || !password) {
    return "All fields are required.";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters.";
  }

  return null;
}

export function validateLogin(data) {
  const { email, password } = data;

  if (!email || !password) {
    return "Email and password are required.";
  }

  return null;
}
