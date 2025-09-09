// this is the utils.js file where we put all the functions that can be reused in different other js files

export function generatePassword() {
            
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const allChars = lowercase + uppercase + numbers;

    const minLength = 14;
    const maxLength = 24;
    const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

    // Ensure 1 lowercase, 1 uppercase, 1 number
    let password = '';
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];

    // Fill the rest randomly
    for (let i = 3; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    password += password.split('').sort(() => 0.5 - Math.random()).join('');
    
    return password;
}