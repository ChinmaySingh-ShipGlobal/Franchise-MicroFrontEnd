import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react(),
      federation({
        name: "/franchise",
        filename: "remoteEntry.js",
        exposes: {
          "./badge": "./src/components/ui/badge",
          "./button": "./src/components/ui/button",
          "./card": "./src/components/ui/card",
          "./input": "./src/components/ui/input",
          "./label": "./src/components/ui/label",
          "./textArea": "./src/components/ui/textArea",
          "./calendar": "./src/components/ui/calendar",
          "./ErrorMessage": "./src/components/elements/ErrorMessage",
          "./AnnouncementBar": "./src/components/elements/AnnouncementBar",
          "./ButtonWithIcon": "./src/components/elements/ButtonWithIcon",
          "./FileInput": "./src/components/elements/FileInput",
          "./FileInputEditable": "./src/components/elements/FileInputEditable",
          "./InfoBox": "./src/components/elements/InfoBox",
          "./LoadingButton": "./src/components/elements/LoadingButton",
          "./LoadingIconButton": "./src/components/elements/LoadingIconButton",
          "./LoadingScreen": "./src/components/elements/LoadingScreen",
          "./PhoneCode": "./src/components/elements/PhoneCode",
          "./ProfileIcon": "./src/components/elements/ProfileIcon",
          "./SearchForm": "./src/components/elements/SearchForm",
          "./SuccessMessage": "./src/components/elements/SuccessMessage",
          "./SGAccordion": "./src/components/ui/accordion",
          "./FranchisePage": "./src/layouts/FranchisePage",
        },

        shared: [
          "react",
          "react-dom",
          "react-router-dom",
          "axios",
          "clsx",
          "zod",
          "zustand",
          "react-hook-form",
          "tailwindcss",
        ],
      }),
    ],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      modulePreload: false,
      target: "esnext",
      minify: false,
      cssCodeSplit: false,
    },
  };
});
