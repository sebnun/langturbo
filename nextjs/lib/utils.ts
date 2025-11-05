export const getDatabaseUri = () => {
  return `postgresql://postgres:${process.env.POSTGRES_PASSWORD!}@127.0.0.1:5432/langturbo`;
};
