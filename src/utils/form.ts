export const getValueFromEvent = (e: any) => {
  if (!e || !e.target) {
    return e;
  }
  const { target } = e;
  return target.type === "checkbox" ? target.checked : target.value;
};
