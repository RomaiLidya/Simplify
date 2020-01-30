import PasswordValidator from 'password-validator';

const {
  PASSWORD_MIN_LEN = '6',
  PASSWORD_MAX_LEN = '32',
  PASSWORD_HAS_UPPERCASE = 'true',
  PASSWORD_HAS_LOWERCASE = 'true',
  PASSWORD_HAS_SYMBOLS = 'false',
  PASSWORD_HAS_DIGITS = 'true',
  PASSWORD_HAS_LETTERS = 'true'
} = process.env;

const passwordValidator = new PasswordValidator();
passwordValidator
  .is()
  .min(+PASSWORD_MIN_LEN)
  .is()
  .max(+PASSWORD_MAX_LEN);

if (PASSWORD_HAS_UPPERCASE === 'true') {
  passwordValidator.has().uppercase();
}

if (PASSWORD_HAS_LOWERCASE === 'true') {
  passwordValidator.has().lowercase();
}

if (PASSWORD_HAS_SYMBOLS === 'true') {
  passwordValidator.has().symbols();
}

if (PASSWORD_HAS_DIGITS === 'true') {
  passwordValidator.has().digits();
}

if (PASSWORD_HAS_LETTERS === 'true') {
  passwordValidator.has().letters();
}

export default passwordValidator;
