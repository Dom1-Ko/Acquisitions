export const formatValidationError = errors => {
  // formatting the errors so that they can be sent to the user, here we are trying to present it in a single string

  if (!errors || !errors.issues) return 'validation failed'; // no errors

  if (Array.isArray(errors.issues))
    return errors.issues.map(i => i.message).join(','); // errors of type array

  return JSON.stringify(errors); // only one validation error
};
