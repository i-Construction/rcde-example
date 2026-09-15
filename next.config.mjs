import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localNodeModules = path.resolve(__dirname, "node_modules");

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@i-con/pcd-viewer", "@react-three/fiber", "@react-three/drei"],
  serverExternalPackages: ["three"],
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      // pcd-viewer も package.json の main が src を指すため transpile 対象。
      // サーバー側ビルドでも同じ実体を使わせる。
      "@i-con/pcd-viewer": path.join(localNodeModules, "@i-con/pcd-viewer"),
    };

    if (isServer) {
      return config;
    }

    // SDK が自身の node_modules 配下の React / fiber を解決してインスタンスが
    // 二重化するのを防ぐ。R3F は単一インスタンスでないと Reconciler が壊れる。
    config.resolve.modules = [localNodeModules, ...(config.resolve.modules ?? ["node_modules"])];
    // Webpack 5 に resolve.dedupe は無いため alias で単一インスタンスを強制する。
    config.resolve.alias = {
      ...config.resolve.alias,
      react: path.join(localNodeModules, "react"),
      "react-dom": path.join(localNodeModules, "react-dom"),
      "react/jsx-runtime": path.join(localNodeModules, "react/jsx-runtime.js"),
      "react/jsx-dev-runtime": path.join(localNodeModules, "react/jsx-dev-runtime.js"),
      "@react-three/fiber": path.join(localNodeModules, "@react-three/fiber"),
      "@react-three/drei": path.join(localNodeModules, "@react-three/drei"),
      three: path.join(localNodeModules, "three"),
    };
    return config;
  },
};

export default nextConfig;
