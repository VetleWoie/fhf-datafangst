import { CssBaseline } from "@mui/material";
import { Layout } from "components";
import { HomeView } from "containers";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "oidc-react";
import { authConfig } from "app/auth";
import { BenchmarkView } from "containers";

export const App: React.FC = () => {
  return (
    <>
      <CssBaseline />
      <AuthProvider {...authConfig}>
        <Layout>
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/benchmark" element={<BenchmarkView />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </>
  );
};
