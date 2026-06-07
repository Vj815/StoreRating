import bcrypt from 'bcryptjs';

bcrypt.hash('TestPass123!', 10).then(hash => {
  console.log(hash);
});