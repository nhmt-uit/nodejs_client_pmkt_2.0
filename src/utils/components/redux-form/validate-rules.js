// Required
export const required = value => (value ? undefined : 'Required');

// maxLength
export const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined;
export const maxLength15 = maxLength(15);

// minLength
export const minLength = min => value =>
  value && value.length < min ? `Must be ${min} characters or more` : undefined;
export const minLength2 = minLength(2);

// number
export const number = value =>
  value && isNaN(Number(value)) ? 'Must be a number' : undefined;

//   minValue
export const minValue = min => value =>
  value && value < min ? `Must be at least ${min}` : undefined;
export const minValue13 = minValue(13);

// email
export const email = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? 'Invalid email address' : undefined;

//  tooYoung
export const tooYoung = value =>
  value && value < 13 ? 'You do not meet the minimum age requirement!' : undefined;

//   aol
export const aol = value =>
  value && /.+@aol\.com/.test(value) ? 'Really? You still use AOL for your email?' : undefined;

  //   alphaNumeric
export const alphaNumeric = value =>
  value && /[^a-zA-Z0-9 ]/i.test(value) ? 'Only alphanumeric characters' : undefined;

//   phoneNumber
export const phoneNumber = value =>
  value && !/^(0|[1-9][0-9]{9})$/i.test(value) ? 'Invalid phone number, must be 10 digits' : undefined;