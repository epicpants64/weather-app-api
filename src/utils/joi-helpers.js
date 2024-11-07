export const validateAndStrip = ({ value, schema, options = {} }) => {
  return schema.validate(value, {
    errors: { wrap: { label: false, array: false } },
    stripUknown: true,
    ...options
  })
}
