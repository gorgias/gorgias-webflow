import { generatePassword } from './utils.js';

let password = generatePassword();
let passwordField = $('[data-name="password"]');

passwordField.val(password);