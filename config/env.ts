const config = {
  values: new Map(),
};

type InitialValues = {
  [key: string]: string;
};

export const initEnv = (values: InitialValues) => {
  Object.entries(values).forEach((entry) => {
    config.values.set(entry[0], entry[1]);
  });
};

export const getEnv = (key: string) => {
  const value = config.values.get(key);
  if (!value) console.warn(`No env value found for key: ${key}.`);
  return value;
};
