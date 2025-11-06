export const getDatabaseUri = () => {
  return `postgresql://postgres:${process.env.POSTGRES_PASSWORD!}@${
    process.env.NODE_ENV === "production" ? "nextjs-postgres" : "127.0.0.1"
  }:5432/langturbo`;
};

export const getProxyUrl = (url: string) => {
  const proxies = [
    process.env.PROXY_0,
    process.env.PROXY_1,
    process.env.PROXY_2,
    process.env.PROXY_3,
    process.env.PROXY_4,
    process.env.PROXY_5,
    process.env.PROXY_6,
    process.env.PROXY_7,
    process.env.PROXY_8,
    process.env.PROXY_9,
    process.env.PROXY_10,
    process.env.PROXY_11,
    process.env.PROXY_12,
    process.env.PROXY_13,
    process.env.PROXY_14,
    process.env.PROXY_15,
    process.env.PROXY_16,
    process.env.PROXY_17,
    process.env.PROXY_18,
    process.env.PROXY_19,
    process.env.PROXY_20,
    process.env.PROXY_21,
    process.env.PROXY_22,
    process.env.PROXY_23,
    process.env.PROXY_24,
    process.env.PROXY_25,
    process.env.PROXY_26,
    process.env.PROXY_27,
    process.env.PROXY_28,
    process.env.PROXY_29,
    process.env.PROXY_30,
    process.env.PROXY_31,
    process.env.PROXY_32,
    process.env.PROXY_33,
    process.env.PROXY_34,
    process.env.PROXY_35,
    process.env.PROXY_36,
    process.env.PROXY_37,
    process.env.PROXY_38,
    process.env.PROXY_39,
  ];

  const randomProxy = proxies.sort(() => 0.5 - Math.random())[0];
  return `${randomProxy}?url=${encodeURIComponent(url)}`;
};
