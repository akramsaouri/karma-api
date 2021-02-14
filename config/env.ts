interface Config {
  values: Values;
}

type Values = {
  [key: string]: string;
};

const config: Config = {
  values: {},
};

export const initEnv = (values: Values) => {
  config.values = values;
};

export const getEnv = (key: string) => {
  const value = config.values[key];
  if (!value) console.warn(`No env value found for key: ${key}.`);
  return value;
};
