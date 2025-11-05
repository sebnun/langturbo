export const getDatabaseUri = () => {
  return `postgresql://postgres:${process.env.POSTGRES_PASSWORD!}@localhost:5432/langturbo`;
};
