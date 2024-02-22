/** @type {import('next').NextConfig} */
const nextConfig = {
    rewrites: async () => {
        return [
          {
            source: "/../chatbot_back-end/app/:path*",
            destination:
              process.env.NODE_ENV === "development"
                ? "http://127.1.1.1:4000/:path*"
                : "/",
          },
        ];
      },
}

module.exports = nextConfig
