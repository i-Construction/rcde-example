import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localNodeModules = path.resolve(__dirname, "node_modules");

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@react-three/fiber", "@react-three/drei"],
  serverExternalPackages: ["three"],
  webpack: (config, { isServer }) => {
    if (isServer) {
      return config;
    }

    // R3F は単一インスタンスでないと Reconciler が壊れる。
    // react / jsx-runtime は alias しない。Next 16 は compiled React を
    // 使っており、node_modules/react へ寄せると ReactCurrentDispatcher が欠ける。
    config.resolve.alias = {
      ...config.resolve.alias,
      "@react-three/fiber": path.join(localNodeModules, "@react-three/fiber"),
      "@react-three/drei": path.join(localNodeModules, "@react-three/drei"),
      three: path.join(localNodeModules, "three"),
    };
    return config;
  },
};

export default nextConfig;
