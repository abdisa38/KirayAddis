import { RouterProvider, createBrowserRouter, Navigate } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import Homepage from "./Homepage";
import SearchResults from "./SearchResults";
import PropertyDetails from "./PropertyDetails";
import TenantExperience from "./TenantExperience";
import LandlordExperience from "./LandlordExperience";
import ListingWorkflow from "./ListingWorkflow";
import AdminExperience from "./AdminExperience";
import AddisAI from "./AddisAI";
import MessagingExperience from "./MessagingExperience";
import TrustSafety from "./TrustSafety";
import Login from "./Login";
import Register from "./Register";
import NotFound from "./NotFound";

const router = createBrowserRouter([
  // Public Marketplace & Discovery
  { path: "/", Component: Homepage },
  { path: "/search", Component: SearchResults },
  { path: "/property", Component: PropertyDetails },
  { path: "/property/:id", Component: PropertyDetails },
  { path: "/ai", Component: AddisAI },
  { path: "/trust-safety", Component: TrustSafety },

  // Authentication
  { path: "/login", Component: Login },
  { path: "/register", Component: Register },

  // Three End-to-End Role Dashboards
  { path: "/tenant", Component: TenantExperience },
  { path: "/home", Component: TenantExperience },
  { path: "/landlord", Component: LandlordExperience },
  { path: "/landlord/listing", Component: ListingWorkflow },
  { path: "/admin", Component: AdminExperience },

  // Messaging & Coordination Center
  { path: "/messages", Component: MessagingExperience },

  // Catch-all
  { path: "*", Component: NotFound },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
