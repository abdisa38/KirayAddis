import { RouterProvider, createBrowserRouter } from "react-router";
import Homepage from "./Homepage";
import SearchResults from "./SearchResults";
import PropertyDetails from "./PropertyDetails";
import EmailVerification from "./EmailVerification";
import TenantExperience from "./TenantExperience";
import Login from "./Login";
import Register from "./Register";
import ListingWorkflow from "./ListingWorkflow";
import AdminExperience from "./AdminExperience";
import AddisAI from "./AddisAI";
import MessagingExperience from "./MessagingExperience";
import TrustSafety from "./TrustSafety";
import DesignSystem from "./DesignSystem";
import PrototypeHub from "./PrototypeHub";
import NotFound from "./NotFound";

const router = createBrowserRouter([
  { path: "/", Component: Homepage },
  { path: "/property", Component: PropertyDetails },
  { path: "/property/:id", Component: PropertyDetails },
  { path: "/search", Component: SearchResults },
  { path: "/login", Component: Login },
  { path: "/register", Component: Register },
  { path: "/auth/verify-email", Component: EmailVerification },
  { path: "/tenant", Component: TenantExperience },
  { path: "/home", Component: TenantExperience },
  { path: "/landlord/listing", Component: ListingWorkflow },
  { path: "/admin", Component: AdminExperience },
  { path: "/ai", Component: AddisAI },
  { path: "/messages", Component: MessagingExperience },
  { path: "/trust-safety", Component: TrustSafety },
  { path: "/design-system", Component: DesignSystem },
  { path: "/prototype", Component: PrototypeHub },
  { path: "*", Component: NotFound },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
