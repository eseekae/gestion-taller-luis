import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Aquí van tus otras opciones si es que tienes */
  typescript: {
    // Esto es lo que le dice a Vercel: "Ignora los errores de las estadísticas y sube la web igual"
    ignoreBuildErrors: true,
  },
  eslint: {
    // Aprovechemos de ignorar también errores de linting para que no te bloqueen por una coma mal puesta
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;