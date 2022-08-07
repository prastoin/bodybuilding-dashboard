module.exports = function (api) {
  api.cache(true);
  return {
    plugins: [
      [
        "inline-dotenv",
        {
          path: "./.env",
        },
      ],
    ],
    presets: ["babel-preset-expo"],
  };
};
