export function objectToFormData(
  data: Record<string, any>,
  form?: FormData,
  parentKey?: string
): FormData {
  const formData = form || new FormData();

  Object.entries(data).forEach(([key, value]) => {
    const fullKey = parentKey ? `${parentKey}[${key}]` : key;

    if (value === null || value === undefined) {
      return;
    }

    if (value instanceof File || value instanceof Blob) {
      formData.append(fullKey, value);
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        objectToFormData({ [index]: item }, formData, fullKey);
      });
    } else if (typeof value === 'object' && !(value instanceof Date)) {
      objectToFormData(value, formData, fullKey);
    } else {
      formData.append(fullKey, String(value));
    }
  });

  return formData;
}
